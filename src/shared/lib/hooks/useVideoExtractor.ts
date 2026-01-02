import { useCallback, useRef, useState } from 'react';

export interface ExtractedFrame {
  id: string;
  timestamp: number;
  dataUrl: string;
  blob: Blob;
}

export interface ExtractionSettings {
  interval: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  startTime: number;
  endTime: number;
}

export function useVideoExtractor() {
  const [frames, setFrames] = useState<ExtractedFrame[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const abortRef = useRef(false);

  const extractFrames = useCallback(async (
    video: HTMLVideoElement,
    settings: ExtractionSettings
  ) => {
    if (!video.duration || isNaN(video.duration)) return;

    setIsExtracting(true);
    setProgress(0);
    setFrames([]);
    abortRef.current = false;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExtracting(false);
      return;
    }

    canvasRef.current = canvas;
    const extractedFrames: ExtractedFrame[] = [];
    const totalFrames = Math.floor(video.duration / settings.interval);

    const wasPlaying = !video.paused;
    if (wasPlaying) video.pause();
    const originalTime = video.currentTime;

    // Determine start and end frame indices
    const startFrameIndex = Math.floor(settings.startTime / settings.interval);
    const endFrameIndex = settings.endTime > 0
        ? Math.floor(settings.endTime / settings.interval)
        : totalFrames;

    for (let i = startFrameIndex; i <= endFrameIndex; i++) {
      if (abortRef.current) break;

      const timestamp = i * settings.interval;
      if (timestamp > video.duration) break;
      if (settings.endTime > 0 && timestamp > settings.endTime) break;

      await new Promise<void>((resolve) => {
        const handleSeeked = () => {
          video.removeEventListener('seeked', handleSeeked);
          resolve();
        };
        video.addEventListener('seeked', handleSeeked);
        video.currentTime = timestamp;
      });

      // Small delay to ensure frame is rendered
      await new Promise(r => setTimeout(r, 50));

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataUrl = canvas.toDataURL(settings.format, settings.quality / 100);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(
          (b) => resolve(b!),
          settings.format,
          settings.quality / 100
        );
      });

      extractedFrames.push({
        id: `frame-${i}-${Date.now()}`,
        timestamp,
        dataUrl,
        blob
      });

      setProgress(((i + 1) / (totalFrames + 1)) * 100);
      setFrames([...extractedFrames]);
    }

    video.currentTime = originalTime;
    setIsExtracting(false);
    setProgress(100);
  }, []);

  const cancelExtraction = useCallback(() => {
    abortRef.current = true;
  }, []);

  const clearFrames = useCallback(() => {
    setFrames([]);
    setProgress(0);
  }, []);

  const captureCurrentFrame = useCallback(async (
    video: HTMLVideoElement,
    settings: Pick<ExtractionSettings, 'format' | 'quality'>
  ): Promise<ExtractedFrame | null> => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL(settings.format, settings.quality / 100);
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (b) => resolve(b!),
        settings.format,
        settings.quality / 100
      );
    });

    const frame: ExtractedFrame = {
      id: `frame-manual-${Date.now()}`,
      timestamp: video.currentTime,
      dataUrl,
      blob
    };

    setFrames(prev => [...prev, frame]);
    return frame;
  }, []);

  return {
    frames,
    isExtracting,
    progress,
    extractFrames,
    cancelExtraction,
    clearFrames,
    captureCurrentFrame
  };
}
