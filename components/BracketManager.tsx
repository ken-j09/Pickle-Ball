
import React from 'react';
import { Team, Match } from '../types';
import MatchCard from './MatchCard';

interface BracketManagerProps {
  teams: Team[];
  matches: Match[];
  onUpdateMatch: (match: Match) => void;
  onGenerateBracket: (numTeams: number) => void;
  activeScorerIds: string[];
  onToggleLive: (matchId: string) => void;
  isDarkMode: boolean;
  onScoreMatch: (matchId: string) => void;
}

const BracketManager: React.FC<BracketManagerProps> = ({ 
  teams, 
  matches, 
  onUpdateMatch, 
  onGenerateBracket, 
  activeScorerIds, 
  onToggleLive,
  onScoreMatch
}) => {
  const isDoubleElim = matches.some(m => m.bracketType === 'losers');
  
  const winnersMatches = matches.filter(m => m.bracketType === 'winners');
  const losersMatches = matches.filter(m => m.bracketType === 'losers');
  const finalsMatches = matches.filter(m => m.bracketType === 'finals');

  const wbRounds: number[] = Array.from(new Set<number>(winnersMatches.map(m => m.round))).sort((a, b) => a - b);
  const lbRounds: number[] = Array.from(new Set<number>(losersMatches.map(m => m.round))).sort((a, b) => a - b);

  const renderBracketSection = (matchesToRender: Match[], rounds: number[], title: string) => {
    return (
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-10 px-8">
           <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{title}</h2>
           <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
        </div>
        <div className="flex gap-0 min-w-max px-8">
          {rounds.map((round, rIndex) => {
            const roundMatches = matchesToRender
              .filter(m => m.round === round)
              .sort((a, b) => (a.position || 0) - (b.position || 0));
            
            const spacingClass = rIndex === 0 ? "gap-8" : rIndex === 1 ? "gap-[164px]" : rIndex === 2 ? "gap-[388px]" : "gap-[836px]";

            return (
              <div key={round} className="flex flex-col items-center w-80 relative">
                <div className="h-12 flex items-center justify-center mb-8">
                  <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-[0.4em] bg-slate-100 dark:bg-slate-800/50 px-6 py-2 rounded-full border border-slate-200 dark:border-slate-700">
                    Round {round + 1}
                  </span>
                </div>
                
                <div className={`flex flex-col justify-center flex-1 ${spacingClass} relative w-full px-4`}>
                  {roundMatches.map((match) => (
                    <div key={match.id} className="relative group">
                      <MatchCard 
                        match={match} 
                        teams={teams} 
                        onUpdate={onUpdateMatch} 
                        isLive={activeScorerIds.includes(match.id)} 
                        onToggleLive={onToggleLive} 
                        onScoreMatch={onScoreMatch}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      {matches.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl text-center shadow-xl border border-slate-100 dark:border-slate-800 max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-sitemap text-3xl text-emerald-500"></i>
          </div>
          <h2 className="text-3xl font-black mb-4 text-slate-800 dark:text-white uppercase tracking-tight">Generate Bracket</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Ensure you have added enough teams to populate the bracket format.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {[4, 8, 16].map(num => (
              <button 
                key={num} 
                onClick={() => onGenerateBracket(num)} 
                disabled={teams.length < num} 
                className="group relative px-8 py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl hover:bg-emerald-500 disabled:opacity-30 transition-all font-black text-xs uppercase tracking-widest shadow-lg active:scale-95"
              >
                {num} Teams
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative overflow-x-auto pb-16 scrollbar-hide">
          {renderBracketSection(winnersMatches, wbRounds, "Winners Bracket")}
          {isDoubleElim && renderBracketSection(losersMatches, lbRounds, "Losers Bracket")}
          {isDoubleElim && finalsMatches.length > 0 && (
            <div className="flex flex-col items-center mt-20">
               <div className="flex items-center gap-4 mb-10 w-full max-w-5xl px-8">
                  <h2 className="text-3xl font-black text-amber-500 dark:text-amber-400 uppercase tracking-tighter">Grand Finals</h2>
                  <div className="h-px flex-1 bg-amber-200 dark:bg-amber-900/30"></div>
               </div>
               <div className="w-96 px-4">
                  <MatchCard 
                    match={finalsMatches[0]} 
                    teams={teams} 
                    onUpdate={onUpdateMatch} 
                    isLive={activeScorerIds.includes(finalsMatches[0].id)} 
                    onToggleLive={onToggleLive} 
                    onScoreMatch={onScoreMatch}
                  />
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BracketManager;
