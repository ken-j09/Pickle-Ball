
import React from 'react';
import { Match, Team } from '../types';

interface LiveScoringProps {
  activeMatches: Match[];
  teams: Team[];
  onUpdateMatch: (match: Match) => void;
  onRemoveMatch: (matchId: string) => void;
  onGoToTournament: () => void;
  onScoreMatch: (matchId: string) => void;
  onLaunchAudience?: () => void;
}

const LiveScoring: React.FC<LiveScoringProps> = ({ 
  activeMatches, 
  teams, 
  onRemoveMatch, 
  onGoToTournament, 
  onScoreMatch,
  onLaunchAudience
}) => {
  if (activeMatches.length === 0) {
    return (
      <div className="text-center py-24 px-6 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto shadow-inner ring-1 ring-slate-100 dark:ring-transparent">
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
          <i className="fa-solid fa-tower-broadcast text-4xl text-slate-300 dark:text-slate-700"></i>
        </div>
        <h2 className="text-3xl font-black text-blue-950 dark:text-white mb-4 uppercase tracking-tighter">Broadcast Ready</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto text-base font-medium leading-relaxed">
          The live dashboard is currently idle. Connect courts to the monitor by clicking the <i className="fa-solid fa-tower-broadcast mx-1 text-red-500"></i> icon in the bracket view.
        </p>
        <button 
          onClick={onGoToTournament}
          className="px-10 py-5 bg-blue-950 dark:bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-blue-900/30 active:scale-95"
        >
          Open Tournament Control
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black text-blue-950 dark:text-white tracking-tighter uppercase leading-none">Operator Console</h2>
          <p className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Controlling {activeMatches.length} Match Station{activeMatches.length > 1 ? 's' : ''}
          </p>
        </div>
        <button 
          onClick={onLaunchAudience}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-500/30 hover:bg-blue-500 transition-all active:scale-95 border-b-4 border-blue-800"
        >
          <i className="fa-solid fa-tv text-lg"></i>
          Launch Projection
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {activeMatches.map((match, idx) => {
          const t1 = teams.find(t => t.id === match.team1Id);
          const t2 = teams.find(t => t.id === match.team2Id);
          return (
            <div key={match.id} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-4 group">
              <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {idx + 1}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Court</span>
                 </div>
                 <button onClick={() => onRemoveMatch(match.id)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors border border-slate-200 dark:border-slate-700">
                    <i className="fa-solid fa-unlink text-xs"></i>
                 </button>
              </div>
              
              <div className="flex items-stretch gap-2">
                <div className="flex-1 flex flex-col items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[9px] font-black uppercase text-slate-400 mb-2 truncate w-full text-center">{t1?.name || 'TBD'}</p>
                   <p className="text-5xl font-black text-blue-950 dark:text-white mb-2">{match.score1 ?? 0}</p>
                </div>
                <div className="flex flex-col justify-center text-slate-300 px-1">
                   <span className="font-black text-[10px]">VS</span>
                </div>
                <div className="flex-1 flex flex-col items-center bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <p className="text-[9px] font-black uppercase text-slate-400 mb-2 truncate w-full text-center">{t2?.name || 'TBD'}</p>
                   <p className="text-5xl font-black text-blue-950 dark:text-white mb-2">{match.score2 ?? 0}</p>
                </div>
              </div>
              
              <button 
                onClick={() => onScoreMatch(match.id)}
                className="w-full py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] border-b-4 border-emerald-700"
              >
                Open Controller
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveScoring;
