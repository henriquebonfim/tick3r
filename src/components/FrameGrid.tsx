import { useState } from 'react';
import { Download, X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ExtractedFrame } from '@/hooks/useVideoExtractor';

interface FrameGridProps {
  frames: ExtractedFrame[];
  onDownloadFrame: (frame: ExtractedFrame) => void;
}

export function FrameGrid({ frames, onDownloadFrame }: FrameGridProps) {
  const [previewFrame, setPreviewFrame] = useState<ExtractedFrame | null>(null);

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  if (frames.length === 0) {
    return null;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">
            Extracted Frames ({frames.length})
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="group relative overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={frame.dataUrl}
                  alt={`Frame at ${formatTimestamp(frame.timestamp)}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white">
                  {formatTimestamp(frame.timestamp)}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setPreviewFrame(frame)}
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => onDownloadFrame(frame)}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="absolute bottom-2 left-2 opacity-100 group-hover:opacity-0 transition-opacity">
                <span className="text-xs font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">
                  {formatTimestamp(frame.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={!!previewFrame} onOpenChange={() => setPreviewFrame(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
            <X className="h-4 w-4" />
          </DialogClose>
          {previewFrame && (
            <div className="relative">
              <img
                src={previewFrame.dataUrl}
                alt={`Frame at ${formatTimestamp(previewFrame.timestamp)}`}
                className="w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">
                    {formatTimestamp(previewFrame.timestamp)}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onDownloadFrame(previewFrame)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
