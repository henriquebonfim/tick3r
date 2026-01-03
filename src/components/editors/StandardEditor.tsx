import { DownloadControls } from '@/components/extract-frames/DownloadControls';
import { ExtractionSettings } from '@/components/extract-frames/ExtractionSettings';
import { FrameGrid } from '@/components/extract-frames/FrameGrid';
import { VideoPlayer } from '@/components/video/VideoPlayer';
import { useFrameDownload } from '@/lib/hooks/useFrameDownload';
import {
  useVideoExtractor,
  type ExtractionSettings as Settings,
} from '@/lib/hooks/useVideoExtractor';
import { Film } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface StandardEditorProps {
  videoFile: File;
  videoUrl: string;
}

export function StandardEditor({ videoFile, videoUrl }: StandardEditorProps) {
  const [videoDuration, setVideoDuration] = useState(0);
  const [format, setFormat] = useState<Settings['format']>('image/jpeg');
  const [quality, setQuality] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    frames,
    isExtracting,
    progress,
    extractFrames,
    cancelExtraction,
    clearFrames,
    captureCurrentFrame,
  } = useVideoExtractor();

  const { downloadFrame, downloadAllAsZip, isZipping, zipProgress } = useFrameDownload();

  // Sync duration when video loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateDuration = () => setVideoDuration(video.duration);

    // Check if already loaded
    if (video.readyState >= 1) {
      updateDuration();
    }

    video.addEventListener('loadedmetadata', updateDuration);
    return () => video.removeEventListener('loadedmetadata', updateDuration);
  }, [videoFile]); // Re-run when file changes

  const handleExtract = useCallback(
    (settings: Settings) => {
      if (!videoRef.current) return;
      setFormat(settings.format);
      setQuality(settings.quality);
      extractFrames(videoRef.current, settings);
    },
    [extractFrames],
  );

  const handleCaptureFrame = useCallback(() => {
    if (!videoRef.current) return;
    captureCurrentFrame(videoRef.current, { format, quality });
  }, [captureCurrentFrame, format, quality]);

  const handleDownloadFrame = useCallback(
    (frame: Parameters<typeof downloadFrame>[0]) => {
      const videoName = videoFile?.name.replace(/\.[^/.]+$/, '') || 'video';
      downloadFrame(frame, format, videoName);
    },
    [downloadFrame, format, videoFile],
  );

  const handleDownloadAll = useCallback(() => {
    const videoName = videoFile?.name.replace(/\.[^/.]+$/, '') || 'video';
    downloadAllAsZip(frames, format, videoName);
  }, [downloadAllAsZip, frames, format, videoFile]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Video Info */}
      <div className="flex items-center gap-3">
        <Film className="h-5 w-5 text-muted-foreground" />
        <span className="truncate font-medium">{videoFile?.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,320px]">
        {/* Left Column - Video & Frames */}
        <div className="space-y-8">
          <VideoPlayer
            videoUrl={videoUrl}
            videoRef={videoRef as React.RefObject<HTMLVideoElement>}
            onCaptureFrame={handleCaptureFrame}
          />

          <DownloadControls
            frames={frames}
            onDownloadAll={handleDownloadAll}
            onClearFrames={clearFrames}
            isZipping={isZipping}
            zipProgress={zipProgress}
          />

          <FrameGrid frames={frames} onDownloadFrame={handleDownloadFrame} />
        </div>

        {/* Right Column - Settings */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <ExtractionSettings
            onExtract={handleExtract}
            onCancel={cancelExtraction}
            isExtracting={isExtracting}
            progress={progress}
            videoDuration={videoDuration}
          />
        </div>
      </div>
    </div>
  );
}
