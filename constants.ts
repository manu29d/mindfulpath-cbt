import { Mood } from './types';

export const MOOD_LABELS: Record<Mood, string> = {
  [Mood.Great]: 'Great',
  [Mood.Good]: 'Good',
  [Mood.Neutral]: 'Okay',
  [Mood.Bad]: 'Low',
  [Mood.Terrible]: 'Terrible',
};

export const MOOD_COLORS: Record<Mood, string> = {
  [Mood.Great]: 'bg-emerald-500',
  [Mood.Good]: 'bg-teal-400',
  [Mood.Neutral]: 'bg-slate-400',
  [Mood.Bad]: 'bg-orange-400',
  [Mood.Terrible]: 'bg-rose-500',
};

export const COMMON_DISTORTIONS = [
  "All-or-Nothing Thinking",
  "Overgeneralization",
  "Mental Filter",
  "Disqualifying the Positive",
  "Jumping to Conclusions",
  "Magnification (Catastrophizing)",
  "Emotional Reasoning",
  "Should Statements",
  "Labeling",
  "Personalization"
];

export const MOCK_DATA_THOUGHTS = [
  {
    id: '1',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    situation: "Meeting with boss",
    mood: Mood.Bad,
    moodIntensity: 70,
    automaticThought: "He didn't smile when I walked in, he must hate my work.",
    evidenceFor: "He was quiet.",
    evidenceAgainst: "He approved my project last week with praise.",
    cognitiveDistortions: ["Jumping to Conclusions", "Mind Reading"],
    balancedThought: "He might just be busy or tired. His lack of a smile doesn't erase his previous praise.",
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
    situation: "Forgot friend's birthday",
    mood: Mood.Terrible,
    moodIntensity: 90,
    automaticThought: "I'm a terrible friend and a bad person.",
    evidenceFor: "I forgot the date.",
    evidenceAgainst: "I've been there for them for 10 years.",
    cognitiveDistortions: ["Labeling", "All-or-Nothing Thinking"],
    balancedThought: "I made a mistake, but that doesn't define my entire character. I can apologize and make it up to them.",
  }
];