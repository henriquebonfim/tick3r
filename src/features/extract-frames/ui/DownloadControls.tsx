import { Download, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import type { ExtractedFrame } from '@/shared/lib/hooks/useVideoExtractor';

interface DownloadControlsProps {
  frames: ExtractedFrame[];
  onDownloadAll: () => void;
  onClearFrames: () => void;
  isZipping: boolean;
  zipProgress: number;
}

export function DownloadControls({
  frames,
  onDownloadAll,
  onClearFrames,
  isZipping,
  zipProgress
}: DownloadControlsProps) {
  if (frames.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex-1">
        {isZipping ? (
          <div className="space-y-2">
            <Progress value={zipProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Creating ZIP file... {Math.round(zipProgress)}%
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {frames.length} frame{frames.length !== 1 ? 's' : ''} ready to download
          </p>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClearFrames}
          disabled={isZipping}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
        
        <Button
          onClick={onDownloadAll}
          disabled={isZipping}
          className="gap-2"
        >
          <Archive className="h-4 w-4" />
          Download ZIP
        </Button>
      </div>
    </div>
  );
}
