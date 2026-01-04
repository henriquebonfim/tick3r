
import React from 'react';

export const SEOContent: React.FC = () => {
  return (
    <article className="prose prose-slate dark:prose-invert mx-auto mt-16 max-w-4xl px-4 py-8 text-center">
      <hr />
      <h2 className="text-3xl font-bold tracking-tight mb-6">Why Use Tick3r for Video Frame Extraction?</h2>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section>
          <h3 className="text-xl font-semibold mb-3">Instant & Secure Client-Side Processing</h3>
          <p className="text-muted-foreground">
            Tick3r processes your video files locally using your browser's specialized media capabilities.
            This means your videos never leave your device, ensuring 100% privacy and lightning-fast speeds compared to server-side uploads.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">High-Quality Frame Capture</h3>
          <p className="text-muted-foreground">
            Get pixel-perfect screenshots from your videos in their original resolution.
            Whether you're working with 4K, 1080p, or high-framerate footage, Tick3r extracts frames without compression artifacts often found in simpler tools.
          </p>
        </section>
      </div>

      <section className="mb-12">
        <div className="bg-surface-elevated rounded-xl p-6 border border-border">
          <h2 className="text-2xl font-bold mb-6">How to Extract Frames from Video</h2>
          <ol className="list-decimal list-inside space-y-4 text-muted-foreground  text-left">
            <li><strong className="text-foreground">Upload your video:</strong> Drag and drop your file or click to select from your device. We support all major formats including MP4, MOV, WebM, and AVI.</li>
            <li><strong className="text-foreground">Navigate to the perfect moment:</strong> Use our precise timeline slider or frame-by-frame controls to find the exact shot you need.</li>
            <li><strong className="text-foreground">Capture and Save:</strong> Click the "Extract Frame" button to instantly save the image as a high-quality PNG or JPEG file.</li>
          </ol>
        </div>
      </section>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8">Perfect for Social Media & Content Creation</h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-6 bg-surface-elevated border border-border rounded-xl">
            <h3 className="text-lg font-semibold mb-2">YouTube Thumbnails</h3>
            <p className="text-muted-foreground text-sm">
              Stop pausing and hoping. Find the exact frame where your expression is perfect for high-CTR thumbnails.
            </p>
          </div>
          <div className="p-6 bg-surface-elevated border border-border rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Instagram & TikTok</h3>
            <p className="text-muted-foreground text-sm">
              Turn your video clips into high-resolution photo posts. Create "behind the scenes" carousels from your video content without needing separate photos.
            </p>
          </div>
          <div className="p-6 bg-surface-elevated border border-border rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Meme Makers</h3>
            <p className="text-muted-foreground text-sm">
              Capture that split-second funny reaction. Tick3r gives you frame-by-frame control to find the exact moment for the perfect meme template.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Is Tick3r free to use?</h3>
            <p className="text-muted-foreground">Yes, Tick3r is completely free and open-source. There are no limits on video file size or the number of frames you can extract.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">What video formats are supported?</h3>
            <p className="text-muted-foreground">We support any video format that your browser can play. This typically includes MP4 (H.264/AVC), WebM (VP8/VP9), and Ogg Theora. Modern browsers also support H.265 (HEVC) on compatible hardware.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Does it work on mobile?</h3>
            <p className="text-muted-foreground">Yes! Tick3r is fully responsive and works on mobile devices, allowing you to extract frames from videos in your camera roll directly on your phone or tablet.</p>
          </section>
        </div>
      </div>

      <footer className="mt-16 border-t border-border pt-8 text-center text-sm text-muted-foreground">
        <p>Tick3r - The most private way to screenshot videos.</p>
      </footer>
    </article>
  );
};
