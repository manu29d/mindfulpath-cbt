export enum Mood {
  Great = 5,
  Good = 4,
  Neutral = 3,
  Bad = 2,
  Terrible = 1,
}

export interface ThoughtRecord {
  id: string;
  date: string;
  situation: string;
  mood: Mood;
  moodIntensity: number; // 0-100
  automaticThought: string;
  evidenceFor: string;
  evidenceAgainst: string;
  cognitiveDistortions: string[];
  balancedThought: string;
  aiAnalysis?: AIAnalysisResult;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  tags: string[];
}

export interface AIAnalysisResult {
  identifiedDistortions: string[];
  suggestion: string;
  encouragement: string;
}

export interface UserState {
  thoughtRecords: ThoughtRecord[];
  journalEntries: JournalEntry[];
  userName: string;
  hasCompletedOnboarding: boolean;
}

export type View = 'dashboard' | 'new-record' | 'journal' | 'history';