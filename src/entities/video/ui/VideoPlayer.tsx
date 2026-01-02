import { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Camera, RotateCcw } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Slider } from '@/shared/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onCaptureFrame: () => void;
}

const PLAYBACK_SPEEDS = [0.25, 0.5, 1, 1.5, 2];

export function VideoPlayer({ videoUrl, videoRef, onCaptureFrame }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  const handleSeek = useCallback((value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  }, [videoRef]);

  const handleSpeedChange = useCallback((value: string) => {
    const speed = parseFloat(value);
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  }, [videoRef]);

  const handleReset = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.pause();
  }, [videoRef]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-foreground/5">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full aspect-video object-contain bg-black"
          playsInline
        />
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-10 w-10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Select value={playbackSpeed.toString()} onValueChange={handleSpeedChange}>
            <SelectTrigger className="w-20 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PLAYBACK_SPEEDS.map((speed) => (
                <SelectItem key={speed} value={speed.toString()}>
                  {speed}x
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="secondary"
          onClick={onCaptureFrame}
          className="gap-2"
        >
          <Camera className="h-4 w-4" />
          Capture Frame
        </Button>
      </div>
    </div>
  );
}
