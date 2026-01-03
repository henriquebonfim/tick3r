import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { ExtractionSettings as ExtractionSettingsType } from '@/lib/hooks/useVideoExtractor';
import { Settings as SettingsIcon, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ExtractionSettingsProps {
  onExtract: (settings: ExtractionSettingsType) => void;
  onCancel: () => void;
  isExtracting: boolean;
  progress: number;
  videoDuration: number;
}

const PRESET_INTERVALS = [1, 2, 5, 10];
const FORMATS = [
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
] as const;

export function ExtractionSettings({
  onExtract,
  onCancel,
  isExtracting,
  progress,
  videoDuration,
}: ExtractionSettingsProps) {
  const [interval, setInterval] = useState(1);
  const [customInterval, setCustomInterval] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [format, setFormat] = useState<ExtractionSettingsType['format']>('image/jpeg');
  // Initialize with full range
  const [timeRange, setTimeRange] = useState<[number, number]>([0, videoDuration || 100]);

  // Reset range when duration changes
  useEffect(() => {
    if (videoDuration > 0) setTimeRange([0, videoDuration]);
  }, [videoDuration]);

  const effectiveInterval = useCustom && customInterval ? parseFloat(customInterval) : interval;

  const rangeDuration = timeRange[1] - timeRange[0];
  const estimatedFrames = rangeDuration > 0 ? Math.floor(rangeDuration / effectiveInterval) + 1 : 0;

  const handleExtract = () => {
    if (effectiveInterval <= 0 || isNaN(effectiveInterval)) return;
    onExtract({
      interval: effectiveInterval,
      format,
      quality: 100,
      startTime: timeRange[0],
      endTime: timeRange[1],
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Extraction Settings</h3>
      </div>

      {/* Time Range Selection */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label>Time Range</Label>
          <span className="text-sm text-muted-foreground">
            {formatTime(timeRange[0])} - {formatTime(timeRange[1])} (
            {Math.round(timeRange[1] - timeRange[0])}s)
          </span>
        </div>
        <Slider
          value={timeRange}
          min={0}
          max={videoDuration || 100}
          step={1}
          minStepsBetweenThumbs={1}
          onValueChange={(val) => {
            if (Array.isArray(val) && val.length === 2) {
              setTimeRange([val[0], val[1]]);
            }
          }}
          disabled={isExtracting}
        />
      </div>

      {/* Interval Selection */}
      <div className="space-y-3">
        <Label>Extract every</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_INTERVALS.map((preset) => (
            <Button
              key={preset}
              variant={!useCustom && interval === preset ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setInterval(preset);
                setUseCustom(false);
              }}
              disabled={isExtracting}
            >
              {preset}s
            </Button>
          ))}
          <Button
            variant={useCustom ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUseCustom(true)}
            disabled={isExtracting}
          >
            Custom
          </Button>
        </div>

        {useCustom && (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0.1"
              step="0.1"
              value={customInterval}
              onChange={(e) => setCustomInterval(e.target.value)}
              placeholder="e.g. 0.5"
              className="w-24"
              disabled={isExtracting}
            />
            <span className="text-sm text-muted-foreground">seconds</span>
          </div>
        )}

        {estimatedFrames > 0 && (
          <p className="text-sm text-muted-foreground">
            ~{estimatedFrames} frames will be extracted
          </p>
        )}
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <Label>Format</Label>
        <Select
          value={format}
          onValueChange={(v) => setFormat(v as ExtractionSettingsType['format'])}
          disabled={isExtracting}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FORMATS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quality Slider - REMOVED (Always 100%) */}

      {/* Progress */}
      {isExtracting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            Extracting frames... {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {isExtracting ? (
          <Button variant="destructive" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        ) : (
          <Button onClick={handleExtract} className="flex-1 gap-2">
            <Zap className="h-4 w-4" />
            Extract Frames
          </Button>
        )}
      </div>
    </div>
  );
}
