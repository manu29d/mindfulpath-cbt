import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, BrainCircuit } from 'lucide-react';
import { Mood } from '../types';
import { MOOD_LABELS, MOOD_COLORS } from '../constants';

interface OnboardingProps {
  onComplete: (name: string, initialMood: Mood) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  const handleNext = () => {
    if (step === 2 && !name.trim()) return;
    setStep(step + 1);
  };

  const handleComplete = () => {
    if (selectedMood) {
      onComplete(name || 'Friend', selectedMood);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        {/* Progress Bar */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-8 md:p-12">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BrainCircuit size={32} />
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-3">Welcome to MindfulPath</h1>
              <p className="text-slate-500 leading-relaxed mb-8">
                Your safe space to track moods, challenge negative thoughts, and build resilience using Cognitive Behavioral Therapy (CBT).
              </p>
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Name */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">What should we call you?</h2>
              <p className="text-slate-500 mb-6">We'll use this to personalize your dashboard.</p>
              
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all mb-8"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && name.trim() && handleNext()}
              />

              <button
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* Step 3: First Mood Check-in */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">How are you feeling right now?</h2>
              <p className="text-slate-500 mb-6">Let's log your first check-in to start your journey.</p>

              <div className="grid grid-cols-1 gap-3 mb-8">
                {Object.entries(MOOD_LABELS).reverse().map(([val, label]) => {
                  const moodVal = Number(val) as Mood;
                  const isSelected = selectedMood === moodVal;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedMood(moodVal)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="font-medium">{label}</span>
                      <div className={`w-4 h-4 rounded-full ${MOOD_COLORS[moodVal]}`} />
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleComplete}
                disabled={!selectedMood}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} /> Finish Setup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;