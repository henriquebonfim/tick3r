import { SEOContent } from '@/components/SEO/SEOContent'; // Import SEOContent
import { VideoUploader } from '@/components/upload-video/VideoUploader';
import { Shield } from 'lucide-react';
import { Suspense, lazy, useCallback, useState } from 'react';

const StandardEditor = lazy(() => import('@/components/editors/StandardEditor').then(module => ({ default: module.StandardEditor })));

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
          <button className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0" onClick={handleBack} title="Choose another video" type="button">
            <img src="/pwa-192x192.png" alt="tick3r" className="h-10 w-10" />
            <span className="text-xl font-bold tracking-tight">Tick3r</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>100% Client-side (No servers)</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!videoUrl ? (
          /* Upload State */
          <div className="mx-auto max-w-4xl space-y-12">
            <section className="mx-auto max-w-2xl space-y-6" aria-label="Upload Video">
              <header className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free Online Video Frame Extractor & Screenshot Tool</h1>
                <p className="text-lg text-muted-foreground">
                  Fast, free, and completely private. No uploads required.
                </p>
              </header>

              <VideoUploader onVideoSelect={handleVideoSelect} />
            </section>

            <SEOContent /> {/* Add SEO rich content */}
          </div>
        ) : (
          /* Editor State */
          <section aria-label="Editor" className="w-full">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            }>
              <StandardEditor videoFile={videoFile} videoUrl={videoUrl} />
            </Suspense>
          </section>
        )}
      </main>
    </div >
  );
};

export default Index;
