/// <reference lib="webworker" />

import { createFile, DataStream, MP4File, MP4Info, MP4Sample } from 'mp4box';
import { frameStorage } from '../storage/frame-storage';
import { generateFrameId } from './frame-utils';

// Types shared between worker and client
export interface ProcessingState {
  processedFrames: number;
  totalFrames: number;
  status: 'idle' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ExtractionConfig {
  interval: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  startTime: number;
  endTime: number;
}

export type WorkerMessage =
  | { type: 'start'; payload: { file: File; config: ExtractionConfig; sessionId: string } }
  | { type: 'cancel' };

export type WorkerResponse =
  | { type: 'progress'; state: ProcessingState }
  | { type: 'frame'; bitmap: ImageBitmap; timestamp: number }
  | { type: 'error'; error: string };

class VideoProcessorWorker {
    private mp4box: MP4File | null = null;
    private decoder: VideoDecoder | null = null;
    private canvas: OffscreenCanvas | null = null;
    private ctx: OffscreenCanvasRenderingContext2D | null = null;
    private state: ProcessingState = { processedFrames: 0, totalFrames: 0, status: 'idle' };
    private videoTrackId: number | null = null;
    private config: ExtractionConfig = { interval: 1, format: 'image/jpeg', quality: 100, startTime: 0, endTime: 0 };
    private sessionId: string = '';
    private lastSavedTimestamp = -1;

    // Chunked loading state
    private file: File | null = null;
    private fileOffset = 0;
    private readonly CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
    private isReading = false;

    // Backpressure control
    private pendingSamples: MP4Sample[] = [];
    private readonly MAX_QUEUE_SIZE = 20;

    constructor() {
        self.onmessage = this.handleMessage.bind(this);
    }

    private handleMessage(event: MessageEvent<WorkerMessage>) {
        const { type } = event.data;
        switch (type) {
            case 'start':
                // @ts-ignore
                const payload = event.data.payload;
                this.start(payload.file, payload.config, payload.sessionId);
                break;
            case 'cancel':
                this.cancel();
                break;
        }
    }

    private postState(state: ProcessingState) {
        self.postMessage({ type: 'progress', state });
    }

    async start(file: File, config: ExtractionConfig, sessionId: string) {
        this.file = file;
        this.config = config;
        this.sessionId = sessionId;
        this.lastSavedTimestamp = -1;
        this.pendingSamples = [];
        this.fileOffset = 0;

        // Reset mp4box
        if (this.mp4box) {
             this.mp4box = null;
        }
        this.mp4box = createFile();

        // Cleanup previous decoder if exists
        if (this.decoder) {
            if (this.decoder.state !== 'closed') this.decoder.close();
            this.decoder = null;
        }

        try {
            await frameStorage.init();

            this.state = { processedFrames: 0, totalFrames: 0, status: 'processing' };
            this.postState(this.state);

            this.initDecoder();
            this.initDemuxer();

            // Start reading file in chunks
            this.readNextChunk();

        } catch (e: any) {
            this.state.status = 'error';
            this.state.error = e.message || String(e);
            this.postState(this.state);
        }
    }

    private initDemuxer() {
        if (!this.mp4box) return;

        this.mp4box.onError = (e) => {
            console.error("MP4Box Error", e);
            this.state.status = 'error';
            this.state.error = "Demuxing failed";
            this.postState(this.state);
        };

        this.mp4box.onReady = (info: MP4Info) => {
            const track = info.videoTracks[0];
            if (!track) {
                this.state.status = 'error';
                this.state.error = "No video track found";
                this.postState(this.state);
                return;
            }

            this.videoTrackId = track.id;
            this.state.totalFrames = track.nb_samples;
            this.postState(this.state);

            // Configure decoder
            const description = this.getExtradata(track);
            this.decoder?.configure({
                codec: track.codec,
                codedHeight: track.video.height,
                codedWidth: track.video.width,
                description
            });

            this.mp4box!.setExtractionOptions(track.id, null, { nbSamples: 100 });
            this.mp4box!.start();
        };

        this.mp4box.onSamples = (id, user, samples) => {
            this.pendingSamples.push(...samples);
            this.processPendingSamples();
        };
    }

    private async readNextChunk() {
        if (!this.file || !this.mp4box || this.state.status !== 'processing') return;

        // Backpressure check
        // If we have too many pending samples or decoder is busy, pause reading.
        // This prevents loading the entire file into RAM (mp4box retains buffer refs).
        // 500 samples * ~1MB (worst case) = 500MB if we are unlucky with high bitrate.
        // Usually 500 samples is just metadata ref. The Mdat might be huge.
        // mp4box `appendBuffer` logic:
        // if `chunk` contains `mdat` data, and `onSamples` is triggered, `samples[i].data` is a view into `chunk`.
        // So `pendingSamples` keeps `chunk` (5MB) alive.
        // If we have 100 chunks pending = 500MB.
        // So we strictly limit pending samples.

        if (this.pendingSamples.length > 200 || (this.decoder && this.decoder.decodeQueueSize > this.MAX_QUEUE_SIZE)) {
            // We are paused. We rely on processPendingSamples to trigger readNextChunk again when queue drains.
            this.isReading = false;
            return;
        }

        if (this.fileOffset >= this.file.size) {
            this.mp4box.flush();
            return;
        }

        this.isReading = true;
        const end = Math.min(this.fileOffset + this.CHUNK_SIZE, this.file.size);
        const chunk = await this.file.slice(this.fileOffset, end).arrayBuffer();

        if (this.state.status !== 'processing') return; // Cancelled during read

        // @ts-ignore - mp4box custom prop
        chunk.fileStart = this.fileOffset;

        this.mp4box.appendBuffer(chunk);

        this.fileOffset += chunk.byteLength;
        this.isReading = false;

        // Schedule next read
        setTimeout(() => this.readNextChunk(), 10);
    }

    cancel() {
        this.state.status = 'idle';
        if (this.decoder) {
            if (this.decoder.state !== 'closed') this.decoder.close();
            this.decoder = null;
        }
        this.mp4box = null;
        this.pendingSamples = [];
        this.file = null;
        this.postState({ ...this.state, status: 'idle' });
    }

    private getExtradata(track: any) {
         const entry = this.mp4box!.getTrackById(track.id).mdia.minf.stbl.stsd.entries[0];
         if (entry.avcC) {
             const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
             entry.avcC.write(stream);
             return new Uint8Array(stream.buffer.slice(8));
         }
         return undefined;
    }

    private initDecoder() {
        this.decoder = new VideoDecoder({
            output: async (frame) => {
                await this.handleFrame(frame);
            },
            error: (e) => {
                console.error("Decoder error", e);
                this.state.status = 'error';
                this.state.error = e.message;
                this.postState(this.state);
            }
        });
    }

    private async handleFrame(frame: VideoFrame) {
        this.concurrentProcessCount++; // available frame processing

        try {
            if (!this.canvas) {
                this.canvas = new OffscreenCanvas(frame.codedWidth, frame.codedHeight);
                this.ctx = this.canvas.getContext('2d');
            }

            if (this.ctx && this.canvas) {
                if (this.canvas.width !== frame.codedWidth) {
                    this.canvas.width = frame.codedWidth;
                    this.canvas.height = frame.codedHeight;
                }

                this.ctx.drawImage(frame, 0, 0);

                const timestampSeconds = frame.timestamp / 1_000_000;

                if (this.config.endTime > 0 && timestampSeconds > this.config.endTime) {
                    frame.close();
                    this.state.status = 'completed';
                    this.postState(this.state);
                    return;
                }

                if (timestampSeconds < this.config.startTime) {
                     frame.close();
                     // Don't recurse directly, let finally block handle it
                     return;
                }

                // Logic check: Save if significantly past last saved (with epsilon for float precision)
                // Or if first frame.
                if (timestampSeconds >= this.lastSavedTimestamp + this.config.interval - 0.05 || this.lastSavedTimestamp === -1) {
                    // Optimistically update timestamp immediately to prevent race condition
                    // where subsequent frames enter this block while this one is still awaiting I/O.
                    this.lastSavedTimestamp = timestampSeconds;

                    try {
                        const blob = await this.canvas.convertToBlob({
                            type: this.config.format,
                            quality: 1
                        });

                        // Important: Draw is done, Blob is created. Close frame ASAP to free GPU memory

                        const bitmap = await createImageBitmap(frame);
                        frame.close(); // Close explicitly here!

                        const id = generateFrameId(frame.timestamp);
                        await frameStorage.saveFrame({
                            id,
                            sessionId: this.sessionId,
                            timestamp: frame.timestamp,
                            blob
                        });

                        self.postMessage({ type: 'frame', bitmap, timestamp: frame.timestamp }, [bitmap] as any);

                        this.state.processedFrames++;
                    } catch (e: any) {
                        console.error('[Worker] Save error', e);
                    }
                }

                frame.close();
                this.postState(this.state);

                if (this.state.totalFrames > 0 && this.state.processedFrames >= this.state.totalFrames) {
                    this.state.status = 'completed';
                    this.postState(this.state);
                }
            }
        } finally {
            this.concurrentProcessCount--;
            // Trigger next batch
            this.processPendingSamples();
        }
    }

    private concurrentProcessCount = 0;
    private readonly MAX_CONCURRENT_PROCESS = 5; // Limit parallel IO operations

    private processPendingSamples() {
        if (!this.decoder || this.decoder.state === 'closed') return;

        // Resume reading if we were paused and have space
        if (!this.isReading && this.pendingSamples.length < 50 && this.decoder.decodeQueueSize < this.MAX_QUEUE_SIZE) {
            this.readNextChunk();
        }

        // Expanded backpressure: Check decode queue AND active IO operations
        if (this.decoder.decodeQueueSize > this.MAX_QUEUE_SIZE || this.concurrentProcessCount >= this.MAX_CONCURRENT_PROCESS) {
             return;
        }

        while (this.pendingSamples.length > 0 && this.decoder.decodeQueueSize <= this.MAX_QUEUE_SIZE && this.concurrentProcessCount < this.MAX_CONCURRENT_PROCESS) {
            const sample = this.pendingSamples.shift()!;

            const type = sample.is_sync ? 'key' : 'delta';
            const chunk = new EncodedVideoChunk({
                type,
                timestamp: sample.cts,
                duration: sample.duration,
                data: sample.data
            });

            this.decoder.decode(chunk);
        }
    }
}

new VideoProcessorWorker();
