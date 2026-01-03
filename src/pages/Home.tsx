import { StandardEditor } from '@/components/editors/StandardEditor';
import { VideoUploader } from '@/components/upload-video/VideoUploader';
import { Shield } from 'lucide-react';
import { useCallback, useState } from 'react';

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleVideoSelect = useCallback((file: File, url: string) => {
    setVideoFile(file);
    setVideoUrl(url);
  }, []);

  const handleBack = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
  }, [videoUrl]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface-elevated">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleBack} title="Choose another video">
            <img src="/pwa-192x192.png" alt="tick3r" className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tight">tick3r</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>100% Client-side (No servers)</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!videoUrl ? (
          /* Upload State */
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold">tick3r - Extract frames from any video</h1>
              <p className="text-muted-foreground">
                Fast, free, and completely private. No uploads required.
              </p>
            </div>

            <VideoUploader onVideoSelect={handleVideoSelect} />
          </div>
        ) : (
          /* Editor State */
          <StandardEditor videoFile={videoFile} videoUrl={videoUrl} />
        )}
      </main>
    </div>
  );
};

export default Index;
