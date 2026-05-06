export const countWords = (text: string): number => {
  if (!text) return 0;
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
};

export type WordCountState = 'empty' | 'under' | 'inRange' | 'over';

export const getWordCountState = (
  count: number,
  min: number,
  max?: number,
): WordCountState => {
  if (count === 0) return 'empty';
  if (count < min) return 'under';
  if (max !== undefined && count > max) return 'over';
  return 'inRange';
};

export const wordCountBadgeText = (
  count: number,
  min: number,
  max?: number,
): string => {
  if (max !== undefined) return `${count} / ${min}–${max} words`;
  return `${count} / ${min}+ words`;
};
