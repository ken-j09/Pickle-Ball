
import React from 'react';
import { Team, Match, TournamentType } from '../types';
import ScheduleManager from './ScheduleManager';
import BracketManager from './BracketManager';

interface TournamentDirectorProps {
  teams: Team[];
  matches: Match[];
  type: TournamentType;
  onUpdateMatch: (match: Match) => void;
  onMoveMatch: (matchId: string, direction: 'up' | 'down') => void;
  onReorderMatches?: (round: number, reordered: Match[]) => void;
  onGenerate: (type: TournamentType) => void;
  activeScorerIds: string[];
  onToggleLive: (matchId: string) => void;
  onResetTournament: () => void;
  isDarkMode: boolean;
  onScoreMatch: (matchId: string) => void;
}

const TournamentDirector: React.FC<TournamentDirectorProps> = ({ 
  teams, 
  matches, 
  type, 
  onUpdateMatch, 
  onMoveMatch,
  onReorderMatches,
  onGenerate, 
  activeScorerIds, 
  onToggleLive,
  onResetTournament,
  isDarkMode,
  onScoreMatch
}) => {
  if (matches.length === 0) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white mb-4 tracking-tight">Choose Tournament Format</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Select the perfect structure for your pickleball event.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button onClick={() => onGenerate('single-round-robin')} disabled={teams.length < 2} className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all text-left">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <i className="fa-solid fa-calendar-day text-xl text-emerald-500 group-hover:text-white"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Single Round Robin</h3>
          </button>
          <button onClick={() => onGenerate('round-robin')} disabled={teams.length < 2} className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-emerald-500 transition-all text-left">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
              <i className="fa-solid fa-calendar-days text-xl text-emerald-500 group-hover:text-white"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Double Round Robin</h3>
          </button>
          <button onClick={() => onGenerate('single-elimination')} disabled={teams.length < 2} className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all text-left">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <i className="fa-solid fa-sitemap text-xl text-blue-500 group-hover:text-white"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Single Elimination</h3>
          </button>
          <button onClick={() => onGenerate('double-elimination')} disabled={teams.length < 4} className="group bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-purple-500 transition-all text-left">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <i className="fa-solid fa-diagram-project text-xl text-purple-500 group-hover:text-white"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Double Elimination</h3>
          </button>
        </div>
      </div>
    );
  }

  const managerProps = {
    teams,
    matches,
    onUpdateMatch,
    onMoveMatch,
    onReorderMatches,
    onToggleLive,
    activeScorerIds,
    isDarkMode,
    onScoreMatch
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={onResetTournament}
          className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <i className="fa-solid fa-arrows-rotate"></i> Change Tournament Format
        </button>
      </div>

      {(type === 'round-robin' || type === 'single-round-robin') ? (
        <ScheduleManager {...managerProps} onGenerateSchedule={() => onGenerate(type)} />
      ) : (
        <BracketManager {...managerProps} onGenerateBracket={() => onGenerate(type)} />
      )}
    </div>
  );
};

export default TournamentDirector;
