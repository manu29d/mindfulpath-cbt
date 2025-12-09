import React, { useState, useEffect } from 'react';
import { 
  LineChart as ChartIcon, 
  PlusCircle, 
  History, 
  Menu, 
  X, 
  BrainCircuit, 
  Smile,
  Sparkles,
  Settings
} from 'lucide-react';
import { UserState, ThoughtRecord, View, Mood } from './types';
import { MOOD_COLORS } from './constants';
import ThoughtRecordForm from './components/ThoughtRecordForm';
import MoodChart from './components/MoodChart';
import Onboarding from './components/Onboarding';
import SettingsModal from './components/SettingsModal';
import { generateJournalPrompt } from './services/geminiService';

const App: React.FC = () => {
  // --- State Management ---
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dailyPrompt, setDailyPrompt] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Load initial state from localStorage or fallback
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem('mindfulpath_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Compatibility check: If user has data but missing 'hasCompletedOnboarding', assume true
        const hasLegacyData = parsed.thoughtRecords && parsed.thoughtRecords.length > 0;
        return {
          ...parsed,
          thoughtRecords: parsed.thoughtRecords || [],
          journalEntries: parsed.journalEntries || [],
          hasCompletedOnboarding: parsed.hasCompletedOnboarding ?? hasLegacyData,
        };
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
    // Default for new users (Start fresh, trigger onboarding)
    return {
      thoughtRecords: [],
      journalEntries: [],
      userName: '',
      hasCompletedOnboarding: false,
    };
  });

  // --- Effects ---

  // Persistence
  useEffect(() => {
    localStorage.setItem('mindfulpath_data', JSON.stringify(state));
  }, [state]);

  // Load daily prompt on mount (only if onboarded)
  useEffect(() => {
    if (state.hasCompletedOnboarding) {
      const loadPrompt = async () => {
        const prompt = await generateJournalPrompt("neutral");
        setDailyPrompt(prompt);
      };
      loadPrompt();
    }
  }, [state.hasCompletedOnboarding]);

  // --- Handlers ---

  const handleOnboardingComplete = (name: string, initialMood: Mood) => {
    const firstRecord: ThoughtRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      situation: "Started my MindfulPath journey",
      mood: initialMood,
      moodIntensity: 50,
      automaticThought: "I'm curious to see how this tool can help me.",
      evidenceFor: "",
      evidenceAgainst: "",
      cognitiveDistortions: [],
      balancedThought: "Taking the first step towards mental well-being is a positive action.",
    };

    setState({
      userName: name,
      thoughtRecords: [firstRecord],
      journalEntries: [],
      hasCompletedOnboarding: true,
    });
  };

  const handleSaveRecord = (record: ThoughtRecord) => {
    setState(prev => ({
      ...prev,
      thoughtRecords: [record, ...prev.thoughtRecords],
    }));
    setCurrentView('dashboard');
  };

  const getAverageMood = () => {
    if (state.thoughtRecords.length === 0) return 0;
    const sum = state.thoughtRecords.slice(0, 7).reduce((acc, curr) => acc + curr.mood, 0);
    return (sum / Math.min(state.thoughtRecords.length, 7)).toFixed(1);
  };

  // --- Render Onboarding if needed ---
  if (!state.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // --- Components (Internal for layout simplicity) ---

  const SidebarItem = ({ view, icon: Icon, label }: { view: View, icon: any, label: string }) => (
    <button 
      onClick={() => { setCurrentView(view); setSidebarOpen(false); }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1
        ${currentView === view 
          ? 'bg-blue-50 text-blue-700 shadow-sm' 
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
    >
      <Icon size={20} />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-white border-r border-slate-100 p-6 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-800 leading-tight">MindfulPath</h1>
            <p className="text-xs text-slate-400">CBT Journal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem view="dashboard" icon={ChartIcon} label="Dashboard" />
          <SidebarItem view="new-record" icon={PlusCircle} label="Check In" />
          <SidebarItem view="history" icon={History} label="History" />
        </nav>

        <div className="mt-auto space-y-4">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium mb-1 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Settings size={20} />
              Settings
            </button>
            <div className="pt-2 border-t border-slate-100">
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Smile size={14} /> Daily Prompt
                </h4>
                <p className="text-sm text-indigo-800 leading-relaxed italic">
                  "{dailyPrompt || 'Loading thought...'}"
                </p>
              </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-0 flex items-center justify-between px-4 lg:hidden bg-white border-b border-slate-100 sticky top-0 z-30">
          <div className="font-bold text-slate-800">MindfulPath</div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            
            {currentView === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">Hello, {state.userName}</h2>
                    <p className="text-slate-500 mt-1">Here is your emotional overview for the week.</p>
                  </div>
                  <button 
                    onClick={() => setCurrentView('new-record')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={20} /> New Entry
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stat Card 1 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-medium mb-2">Total Entries</div>
                    <div className="text-4xl font-bold text-slate-800">{state.thoughtRecords.length}</div>
                  </div>
                  {/* Stat Card 2 */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-slate-400 text-sm font-medium mb-2">Avg. Mood (7 Days)</div>
                    <div className="flex items-end gap-2">
                      <div className="text-4xl font-bold text-slate-800">{getAverageMood()}</div>
                      <div className="text-slate-400 text-sm mb-1">/ 5.0</div>
                    </div>
                  </div>
                  {/* Stat Card 3 */}
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white">
                    <div className="text-indigo-100 text-sm font-medium mb-2">Insight</div>
                    <p className="text-sm font-medium leading-relaxed opacity-90">
                      "You've been tracking consistently. Noticing patterns is the first step to change."
                    </p>
                  </div>
                </div>

                <MoodChart data={state.thoughtRecords} />

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Recent Thoughts</h3>
                    <button 
                      onClick={() => setCurrentView('history')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {state.thoughtRecords.length === 0 ? (
                       <div className="p-8 text-center text-slate-400">
                         No records yet. Click "New Entry" to start.
                       </div>
                    ) : (
                      state.thoughtRecords.slice(0, 3).map((record) => (
                        <div key={record.id} className="p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium text-slate-400">{new Date(record.date).toLocaleDateString()}</span>
                            <div className={`w-3 h-3 rounded-full ${MOOD_COLORS[record.mood]}`} />
                          </div>
                          <h4 className="font-semibold text-slate-800 mb-1">{record.situation}</h4>
                          <p className="text-slate-500 text-sm line-clamp-2">{record.balancedThought || record.automaticThought}</p>
                          {record.aiAnalysis && (
                            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                              <Sparkles size={12} /> AI Analyzed
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'new-record' && (
              <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
                <ThoughtRecordForm 
                  onSave={handleSaveRecord}
                  onCancel={() => setCurrentView('dashboard')}
                />
              </div>
            )}

            {currentView === 'history' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">History</h2>
                </div>
                <div className="grid gap-4">
                  {state.thoughtRecords.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-slate-100 text-slate-400">
                      No history found.
                    </div>
                  ) : (
                    state.thoughtRecords.map((record) => (
                      <div key={record.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${MOOD_COLORS[record.mood]}`}>
                                {record.mood}
                              </div>
                              <div>
                                <h3 className="font-bold text-slate-800">{record.situation}</h3>
                                <p className="text-xs text-slate-400">{new Date(record.date).toLocaleString()}</p>
                              </div>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-6 text-sm">
                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                              <span className="block text-xs font-bold text-rose-700 uppercase mb-2">Negative Thought</span>
                              <p className="text-slate-700">{record.automaticThought}</p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {record.cognitiveDistortions.map(d => (
                                  <span key={d} className="bg-white/80 text-rose-800 px-2 py-0.5 rounded text-xs">{d}</span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                              <span className="block text-xs font-bold text-emerald-700 uppercase mb-2">Balanced Thought</span>
                              <p className="text-slate-700">{record.balancedThought || "No balanced thought recorded."}</p>
                            </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;