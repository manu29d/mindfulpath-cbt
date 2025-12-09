import React, { useState } from 'react';
import { ThoughtRecord, Mood, AIAnalysisResult } from '../types';
import { analyzeThoughtWithGemini } from '../services/geminiService';
import { MOOD_LABELS, COMMON_DISTORTIONS } from '../constants';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onSave: (record: ThoughtRecord) => void;
  onCancel: () => void;
}

const ThoughtRecordForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [situation, setSituation] = useState('');
  const [mood, setMood] = useState<Mood>(Mood.Neutral);
  const [moodIntensity, setMoodIntensity] = useState(50);
  const [automaticThought, setAutomaticThought] = useState('');
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [selectedDistortions, setSelectedDistortions] = useState<string[]>([]);
  
  // AI State
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!situation || !automaticThought) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeThoughtWithGemini(situation, automaticThought);
      setAiResult(result);
      // Pre-select identified distortions if found in our list
      const matches = COMMON_DISTORTIONS.filter(d => 
        result.identifiedDistortions.some(id => id.toLowerCase().includes(d.toLowerCase()))
      );
      if (matches.length > 0) setSelectedDistortions(prev => Array.from(new Set([...prev, ...matches])));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    const newRecord: ThoughtRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      situation,
      mood,
      moodIntensity,
      automaticThought,
      evidenceFor,
      evidenceAgainst,
      cognitiveDistortions: selectedDistortions,
      balancedThought,
      aiAnalysis: aiResult || undefined,
    };
    onSave(newRecord);
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 px-4">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors
            ${step >= s ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {s}
          </div>
          {s < 3 && <div className={`w-12 h-1 mx-2 ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col min-h-[600px]">
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-800">New Thought Record</h2>
        <p className="text-slate-500 text-sm">Challenge negative thinking patterns using CBT.</p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {renderStepIndicator()}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">1. The Situation</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-24 text-slate-800"
                placeholder="Where were you? What happened? (e.g., 'Received a vague email from boss')"
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-4">2. How did you feel?</label>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Object.entries(MOOD_LABELS).map(([val, label]) => {
                  const moodVal = Number(val) as Mood;
                  return (
                    <button
                      key={val}
                      onClick={() => setMood(moodVal)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        mood === moodVal 
                          ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Intensity</span>
                  <span>{moodIntensity}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={moodIntensity} 
                  onChange={(e) => setMoodIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">3. Automatic Negative Thought</label>
              <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-slate-800"
                placeholder="What went through your mind? (e.g., 'I am going to get fired')"
                value={automaticThought}
                onChange={(e) => setAutomaticThought(e.target.value)}
              />
            </div>

            {/* AI Analysis Section */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <Sparkles size={16} /> AI Insight
                </h4>
                {!aiResult && (
                  <button 
                    onClick={handleAnalyze}
                    disabled={!situation || !automaticThought || isAnalyzing}
                    className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-full hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                  >
                    {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : 'Analyze Thought'}
                  </button>
                )}
              </div>
              
              {!aiResult && !isAnalyzing && (
                <p className="text-xs text-indigo-700">Describe your situation and thought, then ask Gemini to help identify cognitive distortions.</p>
              )}

              {aiResult && (
                <div className="space-y-3 mt-3 text-sm">
                  <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-sm">
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Potential Distortions</span>
                    <div className="flex flex-wrap gap-1">
                      {aiResult.identifiedDistortions.map((d, i) => (
                        <span key={i} className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded text-xs font-medium">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-indigo-100 shadow-sm">
                     <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Perspective Shift</span>
                     <p className="text-slate-700 italic">"{aiResult.suggestion}"</p>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Distortions (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {COMMON_DISTORTIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDistortions(prev => 
                      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
                    )}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      selectedDistortions.includes(d) 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-green-700">Evidence For Thought</label>
                  <textarea 
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 text-sm text-slate-800"
                    placeholder="Facts that support the negative thought..."
                    value={evidenceFor}
                    onChange={(e) => setEvidenceFor(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-rose-700">Evidence Against Thought</label>
                  <textarea 
                    className="w-full p-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 text-sm text-slate-800"
                    placeholder="Facts that contradict the negative thought..."
                    value={evidenceAgainst}
                    onChange={(e) => setEvidenceAgainst(e.target.value)}
                  />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">5. Balanced Thought</label>
                {aiResult && !balancedThought && (
                  <button 
                    onClick={() => setBalancedThought(aiResult.suggestion)}
                    className="text-xs text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1"
                  >
                    <Sparkles size={12} /> Use AI suggestion
                  </button>
                )}
                <textarea 
                  className="w-full p-3 border-2 border-blue-100 bg-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24 text-slate-800"
                  placeholder="Considering the evidence, what is a more realistic way to view the situation?"
                  value={balancedThought}
                  onChange={(e) => setBalancedThought(e.target.value)}
                />
              </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
        <button 
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-800 font-medium px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-white transition-colors"
            >
              Back
            </button>
          )}
          {step < 3 ? (
             <button 
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !situation) || (step === 2 && !automaticThought)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
           >
             Next
           </button>
          ) : (
            <button 
              onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> Save Record
            </button>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default ThoughtRecordForm;