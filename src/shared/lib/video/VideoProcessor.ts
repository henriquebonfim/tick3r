import { ExtractionConfig, ProcessingState, WorkerMessage, WorkerResponse } from './video-processor.worker';

// Re-export types for consumers
export type { ExtractionConfig, ProcessingState };

export class VideoProcessor {
    private worker: Worker | null = null;
    private onProgress: (state: ProcessingState) => void;
    private onFrame?: (bitmap: ImageBitmap, timestamp: number) => void;

    constructor(onProgress: (state: ProcessingState) => void, onFrame?: (bitmap: ImageBitmap, timestamp: number) => void) {
        this.onProgress = onProgress;
        this.onFrame = onFrame;
    }

    start(file: File, config: ExtractionConfig) {
        // terminate existing worker if any to ensure clean state
        if (this.worker) {
            this.worker.terminate();
        }

        // Initialize new worker
        this.worker = new Worker(new URL('./video-processor.worker.ts', import.meta.url), { type: 'module' });

        this.worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            const { type } = event.data;
            switch (type) {
                case 'progress':
                    // @ts-ignore
                    this.onProgress(event.data.state);
                    break;
                case 'frame':
                    // @ts-ignore
                    if (this.onFrame) this.onFrame(event.data.bitmap, event.data.timestamp);
                    break;
                case 'error':
                    // @ts-ignore
                    this.onProgress({
                        processedFrames: 0,
                        totalFrames: 0,
                        status: 'error',
                        // @ts-ignore
                        error: event.data.error
                    });
                    break;
            }
        };

        this.worker.onerror = (e) => {
            console.error("Worker Startup Error:", e);
            // Check if it's a loading error (script not found/404)
            if (e instanceof Event) {
                 console.error("Worker failed to load script. Check network tab for 404s on video-processor.worker.ts");
            }
            this.onProgress({
                processedFrames: 0,
                totalFrames: 0,
                status: 'error',
                error: "Worker failed to start. See console for details."
            });
        };

        // Generate session ID
        const sessionId = `session-${Date.now()}`;

        // Send start command
        const message: WorkerMessage = {
            type: 'start',
            payload: { file, config, sessionId }
        };
        this.worker.postMessage(message);

        return sessionId;
    }

    cancel() {
        if (this.worker) {
            this.worker.terminate(); // Hard kill for immediate stop
            this.worker = null;
        }
        this.onProgress({
            processedFrames: 0,
            totalFrames: 0,
            status: 'idle'
        });
    }
}
