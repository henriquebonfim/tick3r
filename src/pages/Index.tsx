import { useState, useRef, useCallback } from 'react';
import { Film, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoUploader } from '@/components/VideoUploader';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ExtractionSettings } from '@/components/ExtractionSettings';
import { FrameGrid } from '@/components/FrameGrid';
import { DownloadControls } from '@/components/DownloadControls';
import { useVideoExtractor, type ExtractionSettings as Settings } from '@/hooks/useVideoExtractor';
import { useFrameDownload } from '@/hooks/useFrameDownload';

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [format, setFormat] = useState<Settings['format']>('image/jpeg');
  const [quality, setQuality] = useState(85);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    frames,
    isExtracting,
    progress,
    extractFrames,
    cancelExtraction,
    clearFrames,
    captureCurrentFrame
  } = useVideoExtractor();
  
  const {
    downloadFrame,
    downloadAllAsZip,
    isZipping,
    zipProgress
  } = useFrameDownload();

  const handleVideoSelect = useCallback((file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
    clearFrames();
  }, [clearFrames]);

  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  const handleExtract = useCallback((settings: Settings) => {
    if (!videoRef.current) return;
    setFormat(settings.format);
    setQuality(settings.quality);
    extractFrames(videoRef.current, settings);
  }, [extractFrames]);

  const handleCaptureFrame = useCallback(() => {
    if (!videoRef.current) return;
    captureCurrentFrame(videoRef.current, { format, quality });
  }, [captureCurrentFrame, format, quality]);

  const handleDownloadFrame = useCallback((frame: Parameters<typeof downloadFrame>[0]) => {
    const videoName = videoFile?.name.replace(/\.[^/.]+$/, '') || 'video';
    downloadFrame(frame, format, videoName);
  }, [downloadFrame, format, videoFile]);

  const handleDownloadAll = useCallback(() => {
    const videoName = videoFile?.name.replace(/\.[^/.]+$/, '') || 'video';
    downloadAllAsZip(frames, format, videoName);
  }, [downloadAllAsZip, frames, format, videoFile]);

  const handleBack = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
    setVideoDuration(0);
    clearFrames();
  }, [videoUrl, clearFrames]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-elevated">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {videoUrl && (
              <Button variant="ghost" size="icon" onClick={handleBack} className="mr-1">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary p-1.5">
                <Film className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight">Frame Extractor</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>100% Client-side</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!videoUrl ? (
          /* Upload State */
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold">Extract frames from any video</h2>
              <p className="text-muted-foreground">
                Fast, free, and completely private. No uploads required.
              </p>
            </div>
            <VideoUploader onVideoSelect={handleVideoSelect} />
          </div>
        ) : (
          /* Editor State */
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Video Info */}
            <div className="flex items-center gap-3">
              <Film className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium truncate">{videoFile?.name}</span>
            </div>

            <div className="grid lg:grid-cols-[1fr,320px] gap-8">
              {/* Left Column - Video & Frames */}
              <div className="space-y-8">
                <VideoPlayer
                  videoUrl={videoUrl}
                  videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                  onCaptureFrame={handleCaptureFrame}
                />
                
                {/* Hidden video element for metadata */}
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="hidden"
                  onLoadedMetadata={handleVideoLoaded}
                />
                
                <DownloadControls
                  frames={frames}
                  onDownloadAll={handleDownloadAll}
                  onClearFrames={clearFrames}
                  isZipping={isZipping}
                  zipProgress={zipProgress}
                />
                
                <FrameGrid
                  frames={frames}
                  onDownloadFrame={handleDownloadFrame}
                />
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
        )}
      </main>
    </div>
  );
};

export default Index;
