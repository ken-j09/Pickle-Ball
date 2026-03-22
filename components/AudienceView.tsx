
import React from 'react';
import { Match, Team } from '../types';

interface AudienceViewProps {
  activeMatches: Match[];
  teams: Team[];
  onClose: () => void;
}

const AudienceView: React.FC<AudienceViewProps> = ({ activeMatches, teams, onClose }) => {
  if (activeMatches.length === 0) {
    return (
      <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-12 text-center">
         <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mb-10">
            <i className="fa-solid fa-tv text-5xl text-slate-700"></i>
         </div>
         <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">No Active Courts</h1>
         <p className="text-slate-500 text-xl font-medium max-w-lg mb-12">Connect courts from the tournament control center to begin the broadcast.</p>
         <button onClick={onClose} className="px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl">
            Return to Console
         </button>
      </div>
    );
  }

  // Support 1, 2, or more matches with different layouts
  const gridClass = activeMatches.length === 1 
    ? 'grid-cols-1' 
    : activeMatches.length === 2 
      ? 'grid-cols-1 lg:grid-cols-2' 
      : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className="fixed inset-0 bg-black text-white z-[300] flex flex-col overflow-hidden">
      {/* HUD Bar */}
      <div className="bg-blue-950 p-6 flex justify-between items-center border-b border-white/5 shrink-0">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                <i className="fa-solid fa-table-tennis-paddle-ball text-2xl text-white"></i>
            </div>
            <div>
               <h2 className="text-2xl font-black tracking-tighter leading-none">PICKLEPRO <span className="text-emerald-500">LIVE</span></h2>
               <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">Broadcasting Tournament Feed</span>
               </div>
            </div>
         </div>
         <button onClick={onClose} className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/30 transition-all">
            <i className="fa-solid fa-xmark text-lg"></i>
         </button>
      </div>

      {/* Main Scoring Grid */}
      <div className={`flex-1 grid ${gridClass} gap-px bg-white/10`}>
        {activeMatches.map((match, idx) => {
          const t1 = teams.find(t => t.id === match.team1Id);
          const t2 = teams.find(t => t.id === match.team2Id);
          return (
            <div key={match.id} className="bg-black relative flex flex-col items-center justify-center p-8 lg:p-12 overflow-hidden">
              {/* Background Ambient Glow */}
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                 <div className="absolute top-0 left-0 w-1/2 h-full" style={{ backgroundColor: t1?.color }} />
                 <div className="absolute top-0 right-0 w-1/2 h-full" style={{ backgroundColor: t2?.color }} />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Court Indicator */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                 <span className="text-xs font-black uppercase tracking-[0.5em] text-white/40">COURT {idx + 1}</span>
              </div>

              <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-around gap-12 lg:gap-24 relative z-10">
                {/* Team 1 Section */}
                <div className="flex-1 flex flex-col items-center text-center animate-in slide-in-from-left-12 duration-1000">
                  <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tight mb-8 drop-shadow-2xl">
                    {t1?.name || 'TBD'}
                  </h3>
                  <div className="relative group">
                    <div className="absolute -inset-10 opacity-20 blur-[60px] rounded-full group-hover:opacity-40 transition-opacity" style={{ backgroundColor: t1?.color }} />
                    <p className="text-[12rem] lg:text-[18rem] font-black tracking-tighter tabular-nums leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
                      {match.score1 ?? 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    {t1?.players.map((p, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 rounded-lg text-sm font-bold text-white/40 uppercase border border-white/5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* VS Divider */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-px h-24 bg-gradient-to-t from-white/20 to-transparent hidden lg:block" />
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10 my-4">
                     <span className="text-xl font-black text-white/20 italic">VS</span>
                  </div>
                  <div className="w-px h-24 bg-gradient-to-b from-white/20 to-transparent hidden lg:block" />
                </div>

                {/* Team 2 Section */}
                <div className="flex-1 flex flex-col items-center text-center animate-in slide-in-from-right-12 duration-1000">
                  <h3 className="text-4xl lg:text-6xl font-black uppercase tracking-tight mb-8 drop-shadow-2xl">
                    {t2?.name || 'TBD'}
                  </h3>
                  <div className="relative group">
                    <div className="absolute -inset-10 opacity-20 blur-[60px] rounded-full group-hover:opacity-40 transition-opacity" style={{ backgroundColor: t2?.color }} />
                    <p className="text-[12rem] lg:text-[18rem] font-black tracking-tighter tabular-nums leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,1)]">
                      {match.score2 ?? 0}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    {t2?.players.map((p, i) => (
                      <span key={i} className="px-4 py-2 bg-white/5 rounded-lg text-sm font-bold text-white/40 uppercase border border-white/5">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Match Winner Splash */}
              {match.isCompleted && (
                <div className="absolute inset-0 bg-emerald-500/90 z-20 flex flex-col items-center justify-center animate-in zoom-in-125 duration-700">
                   <div className="w-32 h-32 bg-white text-emerald-500 rounded-[3rem] flex items-center justify-center shadow-2xl mb-8 rotate-3">
                      <i className="fa-solid fa-crown text-6xl"></i>
                   </div>
                   <h1 className="text-8xl font-black uppercase tracking-tighter mb-2 italic">VICTORY</h1>
                   <h2 className="text-5xl font-black uppercase text-white tracking-tight">
                      {teams.find(t => t.id === match.winnerId)?.name}
                   </h2>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Branding Bar */}
      <div className="bg-black p-8 flex justify-center items-center shrink-0">
         <div className="flex items-center gap-12">
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Status</span>
               <span className="text-xs font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 Active System
               </span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-1">Time</span>
               <span className="text-xs font-black text-white uppercase tracking-widest">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AudienceView;
