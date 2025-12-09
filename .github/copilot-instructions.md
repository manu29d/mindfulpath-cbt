# MindfulPath CBT - Copilot Instructions

## Project Overview

MindfulPath is a **CBT (Cognitive Behavioral Therapy) mood journaling app** using React, TypeScript, and Gemini AI. Users log situations, track automatic thoughts, identify cognitive distortions, and receive AI-powered reframing suggestions. All data is persisted locally via localStorage—no backend.

**Architecture**: Client-side React SPA with localStorage persistence + Gemini API integration.

## Key Structural Patterns

### 1. Data Flow & State Management (`App.tsx` is the source of truth)
- **Central state**: `UserState` (types.ts) contains `thoughtRecords`, `journalEntries`, `userName`, `hasCompletedOnboarding`
- **Persistence**: Every state change auto-saves to localStorage via useEffect (line 51-53 in App.tsx)
- **Data structures**: 
  - `ThoughtRecord`: Core CBT exercise with AI analysis results
  - `Mood`: Enum (1-5 scale) used in dropdowns and charts
- **Pattern**: Components are stateless; they call parent callbacks (`onSave`, `onCancel`) to update state

### 2. AI Integration (`services/geminiService.ts`)
- Uses `@google/genai` library with structured schema for guaranteed response format
- API key sourced from: localStorage `gemini_api_key` > environment variable `API_KEY`
- **Schema validation**: `analysisSchema` defines exact return type: `identifiedDistortions[]`, `suggestion`, `encouragement`
- Used only in `ThoughtRecordForm` when user clicks "Get AI Insight"
- Error handling: Catches missing API key, logs to console, but allows form submission without AI

### 3. Multi-Step Form Pattern (`ThoughtRecordForm.tsx`)
- Step 1: Situation + Mood + Intensity
- Step 2: Automatic thought + Evidence + Distortions  
- Step 3: Review + AI analysis + Balanced thought
- Uses step state to conditionally render sections; CSS transitions on step change
- `handleAnalyze()` fetches AI results mid-form (doesn't require final submission)
- Distortion auto-selection: Matches API response against `COMMON_DISTORTIONS` list (constants.ts)

### 4. Onboarding & Legacy Data Compatibility
- First-time users see `Onboarding` component (3-step intro)
- Onboarding creates initial "starter" `ThoughtRecord` with hardcoded inspirational content
- Migration logic (App.tsx lines 35-41): Detects if user has legacy data → auto-sets `hasCompletedOnboarding: true`
- Skip onboarding by setting `hasCompletedOnboarding: true` in localStorage for testing

### 5. Constants & Styling Patterns
- `MOOD_LABELS` and `MOOD_COLORS` maps in constants.ts—always use for consistency
- Mood color scheme: Great=emerald, Good=teal, Neutral=slate, Bad=orange, Terrible=rose
- **Tailwind**: All styling is Tailwind; no CSS modules or inline styles except for dynamic values
- Icon library: `lucide-react` for all UI icons

## Development Workflow

### Running the App
```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # TypeScript check + Vite build to ./dist
npm run preview      # Preview production build locally
```

### Testing Tips
- **localStorage inspection**: Open DevTools → Application → localStorage → find `mindfulpath_data`
- **API testing**: Set `gemini_api_key` in localStorage before submitting thought records
- **Reset data**: Delete `mindfulpath_data` from localStorage to trigger onboarding again
- **Build check**: `npm run build` runs `tsc` first—fix TypeScript errors before Vite build

### Deployment
- GitHub Pages via `npm run deploy` (pushes `dist/` to `gh-pages` branch)
- Requires `homepage` in package.json to match repo URL
- GitHub Actions workflow handles automatic deployment on push to main (see README.md)

### Build Optimization
- **Code splitting**: `vite.config.ts` uses `rollupOptions.manualChunks` to separate vendor libraries:
  - `vendor-react`: React & React DOM (separate for better caching)
  - `vendor-charts`: Recharts (largest dependency)
  - `vendor-gemini`: Google Gemini AI library
- **Chunk size warning**: Suppressed at 1000 KB (libraries are large but necessary for functionality)
- These chunks load in parallel on initial page load, improving perceived performance

## Common Patterns & Conventions

### Import Pattern
- Always import types from `'./types'` (e.g., `ThoughtRecord`, `Mood`, `UserState`)
- Always import constants from `'./constants'` (e.g., `MOOD_LABELS`, `COMMON_DISTORTIONS`)
- Lucide icons as named imports from `'lucide-react'`

### Component Props
- All components are functional (React.FC<Props>) with explicit interfaces defined above the component
- Callbacks are required (no optional handlers); components don't handle their own save/cancel logic
- Example: `ThoughtRecordForm` receives `onSave(record)` and `onCancel()` from parent

### Mood & Distortion Selection
- Mood is always an enum value; never a string
- Distortions are stored as string[] matching entries in `COMMON_DISTORTIONS` list
- When comparing user input to distortions, use case-insensitive matching

### Error Handling
- No try-catch blocks for UI errors; let exceptions bubble up (logs appear in console)
- API failures in Gemini service: Log error and return gracefully; form can be submitted without AI
- localStorage parse failures: Log error, proceed with default empty state

## File Organization Quick Reference

```
src/
  App.tsx                    # Main component, state holder, view router
  types.ts                   # All TypeScript interfaces & enums
  constants.ts               # MOOD_LABELS, MOOD_COLORS, COMMON_DISTORTIONS
  services/geminiService.ts  # AI analysis & journal prompt generation
  components/
    ThoughtRecordForm.tsx    # Multi-step CBT form with AI integration
    MoodChart.tsx            # Recharts line chart (last 7 days)
    Onboarding.tsx           # 3-step welcome flow
    SettingsModal.tsx        # API key configuration
```

## Key Decisions & Why

- **localStorage instead of DB**: Ensures privacy (no server), works offline, no backend complexity
- **Enum for Mood**: Type safety prevents invalid mood values; numerical values (1-5) enable charting
- **Gemini structured output**: Schema enforces response format; reduces parsing errors
- **Onboarding as separate component**: Clear UX flow; easy to test and modify welcome sequence
- **Thought records immutable (prepended)**: `[newRecord, ...prev.thoughtRecords]` maintains chronological reverse order for dashboard
