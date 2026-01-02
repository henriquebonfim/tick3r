import { VideoUploader } from '@/features/upload-video/ui/VideoUploader';
import { Button } from '@/shared/ui/button';
import { ProEditor } from '@/widgets/editors/ui/ProEditor';
import { Film, Shield } from 'lucide-react';
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {videoUrl && (
              <Button variant="ghost" type="button" onClick={handleBack} className="mr-1">
                Back
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
          <ProEditor videoFile={videoFile} videoUrl={videoUrl} />
        )}
      </main>
    </div>
  );
};

export default Index;
