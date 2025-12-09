import React, { useState, useEffect } from 'react';
import { X, Key, Trash2, Check, Shield } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('gemini_api_key');
      setSavedKey(stored);
      setApiKey('');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!apiKey.trim()) return;
    localStorage.setItem('gemini_api_key', apiKey.trim());
    setSavedKey(apiKey.trim());
    setApiKey('');
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setSavedKey(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex items-center justify-between p-4 border-b border-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">Settings</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
           {/* API Key Section */}
           <div className="space-y-3">
             <h4 className="font-semibold text-slate-700 flex items-center gap-2">
               <Key size={18} className="text-blue-500"/> Gemini API Key
             </h4>
             
             {savedKey ? (
               <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                   <Check size={16} />
                   <span>Custom API Key is active</span>
                 </div>
                 <button 
                   onClick={handleClear}
                   className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-md transition-colors"
                   title="Remove Key"
                 >
                   <Trash2 size={16} />
                 </button>
               </div>
             ) : (
               <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex gap-3">
                 <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                 <p className="text-xs text-slate-500">
                   Using system default key. You can provide your own key to ensure service continuity or use higher limits.
                 </p>
               </div>
             )}

             <div className="space-y-2">
               <label className="text-sm text-slate-600 block">
                 {savedKey ? 'Update API Key' : 'Enter Custom API Key'}
               </label>
               <div className="flex gap-2">
                 <input
                   type="password"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                   placeholder="AIzaSy..."
                   className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-400"
                 />
                 <button
                   onClick={handleSave}
                   disabled={!apiKey.trim()}
                   className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 >
                   Save
                 </button>
               </div>
               <p className="text-[10px] text-slate-400">
                 Your key is stored locally in your browser and used directly with the Gemini API.
               </p>
             </div>
           </div>

           <div className="pt-4 border-t border-slate-50">
             <h4 className="font-semibold text-slate-700 mb-2 text-sm">About MindfulPath</h4>
             <p className="text-xs text-slate-500 leading-relaxed">
               MindfulPath helps you track your mood and challenge negative thoughts using CBT principles.
               <br/>
               Version 1.0.0
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;