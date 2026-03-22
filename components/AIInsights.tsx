
import React, { useState } from 'react';
import { Team, Match } from '../types';
import { generateTournamentRecap } from '../services/geminiService';

interface AIInsightsProps {
  teams: Team[];
  matches: Match[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ teams, matches }) => {
  const [recap, setRecap] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateTournamentRecap(teams, matches);
    setRecap(result);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-blue-950 dark:bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-emerald-500/30 backdrop-blur-md">
            <i className="fa-solid fa-wand-magic-sparkles animate-pulse"></i> GenAI Analysis Active
          </div>
          <h2 className="text-4xl font-black mb-6 leading-[1.1] tracking-tight">AI Scouting Report & Strategy Feed.</h2>
          <p className="text-blue-100/70 mb-10 leading-relaxed text-lg font-medium">
            Generate an immersive professional commentary recap of your tournament. Our AI analyzes match scores and player performance to provide tactical insights.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleGenerate}
              disabled={loading || matches.filter(m => m.isCompleted).length === 0}
              className="px-10 py-5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-20 text-white font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center gap-4 shadow-2xl shadow-emerald-500/40 active:scale-95"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin text-lg"></i> Processing Data...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-podcast text-lg"></i> Generate Recap
                </>
              )}
            </button>
            {recap && (
              <button onClick={() => setRecap(null)} className="px-8 py-5 bg-blue-900/50 hover:bg-blue-800 text-blue-100 font-black uppercase text-xs tracking-widest rounded-2xl transition-all">
                Reset Feed
              </button>
            )}
          </div>
          
          {matches.filter(m => m.isCompleted).length === 0 && (
             <div className="mt-8 flex items-center gap-3 text-amber-400/80 bg-amber-400/5 px-4 py-2 rounded-xl border border-amber-400/20 w-fit">
                <i className="fa-solid fa-circle-exclamation text-xs"></i>
                <p className="text-[10px] font-black uppercase tracking-widest">Complete 1 match to activate AI</p>
             </div>
          )}
        </div>

        {/* Themed Gradient */}
        <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 -mr-40 -mb-40 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="absolute -bottom-20 -right-20 p-8 hidden xl:block opacity-5 grayscale pointer-events-none">
           <i className="fa-solid fa-table-tennis-paddle-ball text-[300px] -rotate-12"></i>
        </div>
      </div>

      {recap && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-blue-50 dark:border-slate-800 shadow-xl animate-in slide-in-from-top-6 duration-500">
          <div className="flex items-center justify-between mb-8 border-b border-blue-50 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500 border border-blue-100 dark:border-slate-700">
                <i className="fa-solid fa-microphone-lines text-xl"></i>
              </div>
              <div>
                <span className="block font-black text-blue-950 dark:text-white text-lg uppercase tracking-tight">Broadcast Recap</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pro Commentary Engine v3.1</span>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               <div className="w-2 h-2 rounded-full bg-blue-100 dark:bg-slate-700"></div>
               <div className="w-2 h-2 rounded-full bg-blue-100 dark:bg-slate-700"></div>
            </div>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic first-letter:text-5xl first-letter:font-black first-letter:text-emerald-500 first-letter:mr-3 first-letter:float-left">
              {recap}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
