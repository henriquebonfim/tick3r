import { useState, useCallback } from 'react';
import JSZip from 'jszip';
import type { ExtractedFrame } from './useVideoExtractor';

export function useFrameDownload() {
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  const getExtension = (format: string) => {
    switch (format) {
      case 'image/jpeg': return 'jpg';
      case 'image/png': return 'png';
      case 'image/webp': return 'webp';
      default: return 'jpg';
    }
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins.toString().padStart(2, '0')}-${secs.toString().padStart(2, '0')}-${ms.toString().padStart(3, '0')}`;
  };

  const downloadFrame = useCallback((frame: ExtractedFrame, format: string, videoName: string) => {
    const ext = getExtension(format);
    const fileName = `${videoName}_${formatTimestamp(frame.timestamp)}.${ext}`;
    
    const link = document.createElement('a');
    link.href = frame.dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadAllAsZip = useCallback(async (
    frames: ExtractedFrame[],
    format: string,
    videoName: string
  ) => {
    if (frames.length === 0) return;

    setIsZipping(true);
    setZipProgress(0);

    const zip = new JSZip();
    const ext = getExtension(format);

    frames.forEach((frame, index) => {
      const fileName = `${videoName}_${formatTimestamp(frame.timestamp)}.${ext}`;
      zip.file(fileName, frame.blob);
      setZipProgress(((index + 1) / frames.length) * 50);
    });

    const blob = await zip.generateAsync(
      { type: 'blob' },
      (metadata) => {
        setZipProgress(50 + (metadata.percent / 2));
      }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${videoName}_frames.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setIsZipping(false);
    setZipProgress(0);
  }, []);

  return {
    downloadFrame,
    downloadAllAsZip,
    isZipping,
    zipProgress
  };
}
