
import React from 'react';

export const SEOContent: React.FC = () => {
  return (
    <article className="prose prose-slate dark:prose-invert mx-auto mt-16 max-w-4xl px-4 py-8 text-center text-foreground">
      <hr className="mb-12 border-border" />

      <header className="mb-16">
        <h2 className="text-3xl font-bold tracking-tight mb-6">The Ultimate Solution for High-Fidelity Video Frame Extraction</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Tick3r redefines how you interact with video content by offering a professional-grade, web-based solution to extract specific frames from video files. In an era where video content dominates the digital landscape, the ability to isolate and save a single, perfect moment as a high-resolution image is invaluable. Whether you are a professional photographer pulling stills from 8K footage, a YouTuber creating click-worthy thumbnails, or a developer building computer vision datasets, Tick3r provides the precision and privacy you need—without shrinking your wallet or compromising your data security.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mb-20 text-left">
        <section className="bg-surface-elevated p-8 rounded-xl border border-border flex flex-col h-full">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-4 text-foreground">Uncompromised Privacy & Security</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
            In today's digital environment, data privacy is paramount. Traditional online converters require you to upload your personal or sensitive video files to a remote cloud server. This exposes your data to potential breaches, unauthorized access, and long waiting times for uploads to complete.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <strong>Tick3r is different.</strong> We utilize advanced WebAssembly and modern browser APIs to process your video <em>entirely on your device</em>. Your file never leaves your computer. This means you can safely use Tick3r for confidential work projects, personal family videos, or proprietary content with zero risk of leakage.
          </p>
        </section>

        <section className="bg-surface-elevated p-8 rounded-xl border border-border flex flex-col h-full">
          <div className="mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
          </div>
          <h3 className="text-xl font-bold mb-4 text-foreground">Pixel-Perfect Extraction Quality</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed flex-grow">
            Taking a screenshot with your operating system's built-in tool often results in low-quality, blurry images that match your monitor's resolution rather than the video's actual quality.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Tick3r taps directly into the raw video stream. If you upload a 4K (3840x2160) video file but are viewing it on a 1080p laptop screen, Tick3r will still extract the full 8.3-megapixel 4K image. We support saving in lossless PNG format for editing and archiving, or high-quality JPEG for easy sharing on social media platforms like Instagram, Twitter, and Facebook.
          </p>
        </section>
      </div>

      <section className="mb-20">
        <div className="bg-surface-elevated rounded-xl p-10 border border-border text-left shadow-sm">
          <h2 className="text-2xl font-bold mb-8 text-center text-foreground">A Professional Workflow in Your Browser</h2>
          <p className="text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
            We have engineered a user experience that rivals desktop software. Forget about installing heavy applications like Adobe Premiere Pro or DaVinci Resolve just to export a simple still image.
          </p>

          <div className="space-y-12">
            <div className="flex gap-6 md:gap-10 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">1</div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-2">Drag, Drop, and Load Instantly</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Simply drag your video file from your desktop directly into the browser window. Because we don't upload the file, it loads instantly—even if it's a massive 10GB movie file. We support a vast array of containers and codecs including MP4, MKV, AVI, MOV, WebM, and HEVC, ensuring compatibility with footage from iPhones, Androids, DSLRs, and Action Cameras.
                </p>
              </div>
            </div>

            <div className="flex gap-6 md:gap-10 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">2</div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-2">Precision Frame-by-Frame Navigation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Finding the "perfect" frame is an art. A standard video player skips huge chunks of time. Tick3r gives you a professional timeline slider and dedicated frame-stepping controls. You can move forward or backward by typically 0.04 seconds (at 25fps), allowing you to catch split-second micro-expressions, lightning strikes, or the exact moment a ball hits the bat.
                </p>
              </div>
            </div>

            <div className="flex gap-6 md:gap-10 items-center">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">3</div>
              <div>
                <h3 className="font-bold text-xl text-foreground mb-2">Export & Batch Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Once you've isolated your target frame, a single click saves it to your device. But we go further: for users who need datasets or storyboards, our "Batch Extraction" mode allows you to automatically save a frame every second (or any custom interval). This is a game-changer for AI researchers training LORA models or video editors creating contact sheets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-foreground">Versatile Use Cases for Every Creator</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <article className="flex flex-col h-full p-6 bg-surface-elevated border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md">
            <h3 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
              <span>📸</span> YouTube Thumbnails
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
              Top YouTubers know that the thumbnail is 50% of the battle. Instead of staging a fake reaction photo, use Tick3r to scan your recording for genuine, high-energy moments. A high-resolution, authentic still from your actual video often performs better and looks more natural than a staged shot.
            </p>
          </article>

          <article className="flex flex-col h-full p-6 bg-surface-elevated border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md">
            <h3 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
              <span>📱</span> Social Media Repurposing
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
              Maximizing reach means being present on all platforms. Turn your horizontal YouTube videos or vertical TikToks into static image posts for Instagram, LinkedIn, or Twitter. Create "Behind the Scenes" carousels or freeze-frame memes that drive engagement back to your main video content.
            </p>
          </article>

          <article className="flex flex-col h-full p-6 bg-surface-elevated border border-border rounded-xl hover:border-primary/50 transition-all hover:shadow-md">
            <h3 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
              <span>🤖</span> AI Dataset Creation
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
              The AI revolution requires data. Developers and hobbyists training Stable Diffusion models or computer vision algorithms need thousands of consistent images. Our bulk extraction tool can turn a 10-minute video into 600 distinct training images in seconds, automating a process that used to take hours of manual work.
            </p>
          </article>
        </div>
      </section>

      <section className="space-y-8 max-w-4xl mx-auto text-left">
        <header className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions (FAQ)</h2>
          <p className="text-muted-foreground mt-3 text-lg">Everything you need to know about extracting images from video</p>
        </header>

        <div className="space-y-4">
          <details className="group bg-surface-elevated rounded-xl border border-border overflow-hidden transition-all duration-200" open>
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-foreground hover:bg-surface/50 transition-colors">
              <h3 className="text-lg font-bold">Is Tick3r really free? What is the catch?</h3>
              <span className="shrink-0 rounded-full bg-primary/10 p-2 text-primary group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <div className="px-6 pb-6 pt-2">
              <p className="leading-relaxed text-muted-foreground">
                Yes, Tick3r is 100% free. There are no paywalls, no hidden subscriptions, no "credit" systems, and absolutely no watermarks on your downloaded images. We believe that basic utility tools should be accessible to everyone. Because the application runs client-side (on your hardware), we do not incur massive server costs for video processing, allowing us to offer this service for free indefinitely.
              </p>
            </div>
          </details>

          <details className="group bg-surface-elevated rounded-xl border border-border overflow-hidden transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-foreground hover:bg-surface/50 transition-colors">
              <h3 className="text-lg font-bold">What makes this better than taking a screenshot?</h3>
              <span className="shrink-0 rounded-full bg-primary/10 p-2 text-primary group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <div className="px-6 pb-6 pt-2">
              <p className="leading-relaxed text-muted-foreground">
                Taking a screenshot captures your <em>screen</em>, not the <em>video</em>. If you play a 4K video on a 1080p monitor and take a screenshot, you only get a 1080p image. You also risk capturing player controls, mouse cursors, or letterboxing (black bars). Tick3r extracts the frame directly from the video file source data, ensuring you get the full resolution, full dynamic range, and a clean image free of UI elements every single time.
              </p>
            </div>
          </details>

          <details className="group bg-surface-elevated rounded-xl border border-border overflow-hidden transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-foreground hover:bg-surface/50 transition-colors">
              <h3 className="text-lg font-bold">Which video formats and codecs are supported?</h3>
              <span className="shrink-0 rounded-full bg-primary/10 p-2 text-primary group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <div className="px-6 pb-6 pt-2">
              <p className="leading-relaxed text-muted-foreground mb-3">
                Tick3r leverages the decoding power of your browser engine (Chromium, Gecko, or WebKit). This generally provides native support for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                <li><strong>MP4:</strong> The internet standard (H.264/AVC).</li>
                <li><strong>WebM:</strong> A high-performance open standard (VP8/VP9/AV1).</li>
                <li><strong>MOV:</strong> QuickTime files popular with iPhone and Mac users.</li>
                <li><strong>MKV & AVI:</strong> Supported in many modern browsers depending on the underlying codec.</li>
                <li><strong>HEVC/H.265:</strong> Fully supported on hardware-compatible devices like modern MacBooks, iPhones, and newer Windows PCs.</li>
              </ul>
            </div>
          </details>

          <details className="group bg-surface-elevated rounded-xl border border-border overflow-hidden transition-all duration-200">
            <summary className="flex cursor-pointer items-center justify-between p-6 font-medium text-foreground hover:bg-surface/50 transition-colors">
              <h3 className="text-lg font-bold">Does this tool work on iPhone and Android?</h3>
              <span className="shrink-0 rounded-full bg-primary/10 p-2 text-primary group-open:-rotate-180 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </span>
            </summary>
            <div className="px-6 pb-6 pt-2">
              <p className="leading-relaxed text-muted-foreground">
                Yes! Tick3r is a Progressive Web App (PWA). This means it works brilliantly in mobile browsers like Safari and Chrome on iOS and Android. You can access videos directly from your Camera Roll or Files app. For the best experience, you can even "Add to Home Screen" to install Tick3r as a standalone app on your phone, allowing for fullscreen use and offline access.
              </p>
            </div>
          </details>
        </div>
      </section>

      <footer className="mt-24 border-t border-border pt-12 text-center text-sm text-muted-foreground">
        <p className="mb-2 font-medium">Tick3r - The Professional's Choice for Private Video Frame Extraction</p>
        <p>&copy; {new Date().getFullYear()} Tick3r. Built with Privacy and Performance in mind.</p>
      </footer>
    </article>
  );
};
