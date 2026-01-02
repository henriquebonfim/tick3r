/**
 * Generates a unique ID for an extracted frame based on its timestamp.
 * Combines a prefix, the timestamp, and a random string to ensure uniqueness.
 *
 * @param timestamp - The frame timestamp in microseconds
 * @returns A unique string ID
 */
export function generateFrameId(timestamp: number): string {
  // Use a random string to ensure uniqueness even if multiple frames have exact same timestamp (unlikely but possible with bugs)
  // We use base36 for compactness
  const randomSuffix = Math.random().toString(36).substr(2, 9);
  return `pro-${timestamp}-${randomSuffix}`;
}
