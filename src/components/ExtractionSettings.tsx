import { useState } from 'react';
import { Settings as SettingsIcon, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import type { ExtractionSettings as ExtractionSettingsType } from '@/hooks/useVideoExtractor';

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
  videoDuration
}: ExtractionSettingsProps) {
  const [interval, setInterval] = useState(1);
  const [customInterval, setCustomInterval] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [format, setFormat] = useState<ExtractionSettingsType['format']>('image/jpeg');
  const [quality, setQuality] = useState(85);

  const effectiveInterval = useCustom && customInterval 
    ? parseFloat(customInterval) 
    : interval;

  const estimatedFrames = videoDuration > 0 
    ? Math.floor(videoDuration / effectiveInterval) + 1 
    : 0;

  const handleExtract = () => {
    if (effectiveInterval <= 0 || isNaN(effectiveInterval)) return;
    onExtract({
      interval: effectiveInterval,
      format,
      quality
    });
  };

  const showQuality = format !== 'image/png';

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold">Extraction Settings</h3>
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

      {/* Quality Slider */}
      {showQuality && (
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Quality</Label>
            <span className="text-sm text-muted-foreground">{quality}%</span>
          </div>
          <Slider
            value={[quality]}
            min={1}
            max={100}
            step={1}
            onValueChange={(v) => setQuality(v[0])}
            disabled={isExtracting}
          />
        </div>
      )}

      {/* Progress */}
      {isExtracting && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
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
