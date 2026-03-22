
import React from 'react';
import { Match, Team } from '../types';

interface MatchCardProps {
  match: Match;
  teams: Team[];
  onUpdate: (match: Match) => void;
  isLive?: boolean;
  onToggleLive?: (matchId: string) => void;
  onMove?: (direction: 'up' | 'down') => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onScoreMatch?: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ 
  match, teams, isLive, onToggleLive, onMove, canMoveUp, canMoveDown, onScoreMatch 
}) => {
  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);

  const isWinnerUI = (teamId: string | null) => match.isCompleted && match.winnerId === teamId;

  return (
    <div className="relative group w-full">
      {onMove && (
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onMove('up')} 
            disabled={!canMoveUp}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-500 disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-up text-xs"></i>
          </button>
          <button 
            onClick={() => onMove('down')} 
            disabled={!canMoveDown}
            className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-500 disabled:opacity-30"
          >
            <i className="fa-solid fa-chevron-down text-xs"></i>
          </button>
        </div>
      )}

      <div className={`bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-lg border transition-all duration-300 ${
        match.isCompleted 
          ? 'border-slate-200 dark:border-slate-800 opacity-80' 
          : 'border-slate-300/60 dark:border-slate-700 shadow-xl'
      } overflow-hidden hover:border-emerald-500 dark:hover:border-emerald-500 ring-1 ring-slate-100 dark:ring-transparent`}>
        
        {/* Team 1 */}
        <div className={`flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800 ${isWinnerUI(match.team1Id) ? 'bg-emerald-50/60 dark:bg-emerald-500/10' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden">
             <div 
               className={`w-2 h-2 rounded-full ${isWinnerUI(match.team1Id) ? 'animate-pulse' : ''}`}
               style={{ backgroundColor: team1?.color || '#cbd5e1' }}
             ></div>
             <span className={`text-xs font-bold truncate ${
               match.team1Id ? 'text-slate-800 dark:text-slate-100' : 'text-slate-300 dark:text-slate-600 italic'
             } ${isWinnerUI(match.team1Id) ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
               {team1?.name || 'TBD'}
             </span>
          </div>
          <span className={`text-xs font-black tabular-nums ${match.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {match.score1 ?? '-'}
          </span>
        </div>

        {/* Team 2 */}
        <div className={`flex items-center justify-between p-3.5 ${isWinnerUI(match.team2Id) ? 'bg-emerald-50/60 dark:bg-emerald-500/10' : ''}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div 
              className={`w-2 h-2 rounded-full ${isWinnerUI(match.team2Id) ? 'animate-pulse' : ''}`}
              style={{ backgroundColor: team2?.color || '#cbd5e1' }}
            ></div>
            <span className={`text-xs font-bold truncate ${
               match.team2Id ? 'text-slate-800 dark:text-slate-100' : 'text-slate-300 dark:text-slate-600 italic'
             } ${isWinnerUI(match.team2Id) ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
               {team2?.name || 'TBD'}
             </span>
          </div>
          <span className={`text-xs font-black tabular-nums ${match.isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
            {match.score2 ?? '-'}
          </span>
        </div>

        {/* Action Overlay */}
        <div className="flex bg-slate-50 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-all border-t border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => onScoreMatch?.(match.id)}
            className="flex-1 py-2 text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border-r border-slate-200/50 dark:border-slate-700"
          >
            {match.isCompleted ? 'Edit' : 'Score'}
          </button>
          <button 
            onClick={() => onToggleLive?.(match.id)}
            className={`px-3 py-2 text-[10px] transition-all ${
              isLive 
                ? 'bg-red-500 text-white' 
                : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <i className={`fa-solid ${isLive ? 'fa-tower-broadcast animate-pulse' : 'fa-video-slash'}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
