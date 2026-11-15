export type PlaybackSpeed = 1 | 0.75 | 0.5;

export interface WordEntry {
  id: string;
  text: string;
  practiceCount: number;
  addedAt: string;
}

export const SPEED_OPTIONS: ReadonlyArray<{
  value: PlaybackSpeed;
  label: string;
  description: string;
}> = [
  { value: 1, label: '1×', description: 'Natural' },
  { value: 0.75, label: '0.75×', description: 'Slow' },
  { value: 0.5, label: '0.5×', description: 'Very Slow' },
];

export const STARTER_WORDS: ReadonlyArray<string> = [
  'thorough',
  'schedule',
  'phenomenon',
  'squirrel',
];
