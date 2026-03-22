
import React, { useMemo, useState } from 'react';
import { Team, Match, StandingsEntry } from '../types';

interface StandingsTableProps {
  teams: Team[];
  matches: Match[];
}

const StandingsTable: React.FC<StandingsTableProps> = ({ teams, matches }) => {
  const [filterMode, setFilterMode] = useState<'overall' | 'season'>('overall');

  const standings = useMemo(() => {
    const data: Record<string, StandingsEntry> = {};
    
    teams.forEach(team => {
      data[team.id] = {
        teamId: team.id,
        wins: 0,
        losses: 0,
        pointsFor: 0,
        pointsAgainst: 0,
        differential: 0
      };
    });

    matches.filter(m => m.isCompleted).forEach(m => {
      if (m.team1Id && m.team2Id && data[m.team1Id] && data[m.team2Id]) {
        const s1 = m.score1 || 0;
        const s2 = m.score2 || 0;

        data[m.team1Id].pointsFor += s1;
        data[m.team1Id].pointsAgainst += s2;
        if (s1 > s2) data[m.team1Id].wins++;
        else if (s2 > s1) data[m.team1Id].losses++;

        data[m.team2Id].pointsFor += s2;
        data[m.team2Id].pointsAgainst += s1;
        if (s2 > s1) data[m.team2Id].wins++;
        else if (s1 > s2) data[m.team2Id].losses++;
      }
    });

    return Object.values(data)
      .map(entry => ({ ...entry, differential: entry.pointsFor - entry.pointsAgainst }))
      .sort((a, b) => b.wins - a.wins || b.differential - a.differential);
  }, [teams, matches]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-300/40 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-700 ring-1 ring-slate-100 dark:ring-transparent">
      <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900">
        <div>
          <h2 className="text-3xl font-black text-blue-950 dark:text-white uppercase tracking-tight leading-none mb-2">Tournament Standings</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Scope: {filterMode === 'overall' ? 'Historical Archive' : 'Current Active Season'}</p>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex gap-1 border border-slate-200 dark:border-slate-700 w-full md:w-auto shadow-sm">
           <button 
             onClick={() => setFilterMode('overall')}
             className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
               filterMode === 'overall' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-900 dark:text-white' 
                : 'text-slate-400 hover:text-blue-500'
             }`}
           >
             Overall
           </button>
           <button 
             onClick={() => setFilterMode('season')}
             className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
               filterMode === 'season' 
                ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-900 dark:text-white' 
                : 'text-slate-400 hover:text-blue-500'
             }`}
           >
             Season
           </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] font-black uppercase text-blue-600 dark:text-slate-500 tracking-[0.2em]">
              <th className="px-8 py-6">Rank</th>
              <th className="px-8 py-6">Team Identity</th>
              <th className="px-6 py-6 text-center">W</th>
              <th className="px-6 py-6 text-center">L</th>
              <th className="px-6 py-6 text-center">Diff ±</th>
              <th className="px-6 py-6 text-center">Ratio</th>
              <th className="px-8 py-6 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {standings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-24 text-center">
                   <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <i className="fa-solid fa-ranking-stars text-3xl text-slate-200 dark:text-slate-700"></i>
                      </div>
                      <p className="text-slate-400 dark:text-slate-600 font-black uppercase tracking-widest text-xs">Awaiting Match Results...</p>
                   </div>
                </td>
              </tr>
            ) : standings.map((entry, index) => {
              const team = teams.find(t => t.id === entry.teamId);
              const totalGames = entry.wins + entry.losses;
              const winPct = totalGames > 0 ? Math.round((entry.wins / totalGames) * 100) : 0;
              const isLeader = index === 0;

              return (
                <tr key={entry.teamId} className={`transition-colors group ${isLeader ? 'bg-emerald-50/30 dark:bg-emerald-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-800/20'}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      {isLeader ? (
                        <div className="w-8 h-8 bg-amber-400 text-white rounded-lg flex items-center justify-center shadow-lg shadow-amber-400/30">
                          <i className="fa-solid fa-crown text-[10px]"></i>
                        </div>
                      ) : (
                        <span className="text-xl font-black text-slate-200 dark:text-slate-700 italic">#{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex-shrink-0 shadow-inner flex items-center justify-center text-white font-black border border-white/20" style={{ backgroundColor: team?.color }}>
                        {team?.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block font-black text-blue-950 dark:text-slate-100">{team?.name}</span>
                        <div className="flex items-center gap-2">
                           {filterMode === 'season' && (
                             <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-1 rounded uppercase">Hot Streak</span>
                           )}
                           <span className="text-[9px] text-slate-400 uppercase font-bold tracking-tight truncate max-w-[150px]">{team?.players.join(' + ')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center font-black text-emerald-600 dark:text-emerald-400 text-lg">{entry.wins}</td>
                  <td className="px-6 py-6 text-center font-bold text-slate-400 dark:text-slate-600">{entry.losses}</td>
                  <td className={`px-6 py-6 text-center font-bold tabular-nums ${entry.differential >= 0 ? 'text-blue-500' : 'text-red-400'}`}>
                    {entry.differential > 0 ? `+${entry.differential}` : entry.differential}
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[10px] font-black text-blue-900 dark:text-slate-300">{winPct}%</span>
                      <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${winPct}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="inline-flex flex-col items-end">
                      <span className="text-lg font-black text-blue-950 dark:text-white tabular-nums">{entry.pointsFor}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase">Total Points</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;
