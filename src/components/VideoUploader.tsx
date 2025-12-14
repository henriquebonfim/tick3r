import { useState, useCallback, useRef } from 'react';
import { Upload, Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoUploaderProps {
  onVideoSelect: (file: File, url: string) => void;
}

export function VideoUploader({ onVideoSelect }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      onVideoSelect(file, url);
    }
  }, [onVideoSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed border-border",
        "bg-surface p-12 transition-all duration-300 ease-out",
        "hover:border-primary/50 hover:bg-primary/5",
        "flex flex-col items-center justify-center gap-4 min-h-[280px]",
        isDragging && "drag-active border-primary"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <div className={cn(
        "rounded-full bg-primary/10 p-4 transition-transform duration-300",
        isDragging && "scale-110"
      )}>
        {isDragging ? (
          <Film className="h-8 w-8 text-primary" />
        ) : (
          <Upload className="h-8 w-8 text-primary" />
        )}
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-foreground">
          {isDragging ? 'Drop your video here' : 'Drag & drop a video'}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          or click to browse
        </p>
      </div>
      
      <p className="text-xs text-muted-foreground/70">
        All processing happens in your browser — nothing is uploaded
      </p>
    </div>
  );
}
