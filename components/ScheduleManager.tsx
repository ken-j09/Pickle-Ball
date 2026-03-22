
import React, { useState } from 'react';
import { Team, Match } from '../types';
import MatchCard from './MatchCard';

interface ScheduleManagerProps {
  teams: Team[];
  matches: Match[];
  onUpdateMatch: (match: Match) => void;
  onMoveMatch: (matchId: string, direction: 'up' | 'down') => void;
  onReorderMatches?: (round: number, reordered: Match[]) => void;
  onGenerateSchedule: () => void;
  activeScorerIds: string[];
  onToggleLive: (matchId: string) => void;
  onScoreMatch: (matchId: string) => void;
}

const ScheduleManager: React.FC<ScheduleManagerProps> = ({ 
  teams, 
  matches, 
  onUpdateMatch, 
  onMoveMatch,
  onReorderMatches,
  onGenerateSchedule, 
  activeScorerIds, 
  onToggleLive,
  onScoreMatch
}) => {
  const rounds: number[] = Array.from(new Set<number>(matches.map(m => m.round))).sort((a, b) => a - b);
  const [draggedMatchId, setDraggedMatchId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedMatchId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string, round: number) => {
    e.preventDefault();
    if (!draggedMatchId || draggedMatchId === targetId || !onReorderMatches) return;

    const roundMatches = matches
      .filter(m => m.round === round)
      .sort((a, b) => (a.position || 0) - (b.position || 0));
    
    const fromIdx = roundMatches.findIndex(m => m.id === draggedMatchId);
    const toIdx = roundMatches.findIndex(m => m.id === targetId);

    if (fromIdx === -1 || toIdx === -1) return;

    const reordered = [...roundMatches];
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    const updatedMatches = reordered.map((m, i) => ({ ...m, position: i }));
    onReorderMatches(round, updatedMatches);
    setDraggedMatchId(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center shadow-sm border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-calendar-plus text-3xl text-slate-300 dark:text-slate-600"></i>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">Generate Schedule</h2>
          <button 
            onClick={onGenerateSchedule} 
            disabled={teams.length < 2} 
            className="px-10 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl hover:bg-emerald-600 dark:hover:bg-emerald-500 disabled:opacity-50 transition-all font-bold"
          >
            Initialize League
          </button>
        </div>
      ) : (
        <div className="space-y-12">
          <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-800/40 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800">
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">League Schedule</h2>
              <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">{rounds.length} Total Rounds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
            {rounds.map(round => (
              <div key={round} className="space-y-6">
                <div className="flex items-center justify-between px-2">
                   <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-emerald-500/20">R{round + 1}</span>
                    <h3 className="font-black text-slate-700 dark:text-slate-300 uppercase tracking-tighter">Round {round + 1}</h3>
                   </div>
                </div>
                <div className="space-y-4 min-h-[100px]">
                  {matches
                    .filter(m => m.round === round)
                    .sort((a, b) => (a.position || 0) - (b.position || 0))
                    .map((match, index, array) => (
                      <div 
                        key={match.id} 
                        className={`relative cursor-move transition-opacity ${draggedMatchId === match.id ? 'opacity-40' : 'opacity-100'}`}
                        draggable={!match.isCompleted}
                        onDragStart={(e) => handleDragStart(e, match.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, match.id, round)}
                      >
                        <MatchCard 
                          match={match} 
                          teams={teams} 
                          onUpdate={onUpdateMatch} 
                          isLive={activeScorerIds.includes(match.id)} 
                          onToggleLive={onToggleLive}
                          onMove={!match.isCompleted ? (dir) => onMoveMatch(match.id, dir) : undefined}
                          canMoveUp={index > 0}
                          canMoveDown={index < array.length - 1}
                          onScoreMatch={onScoreMatch}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleManager;
