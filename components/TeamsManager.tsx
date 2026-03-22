
import React, { useState } from 'react';
import { Team } from '../types';

interface TeamsManagerProps {
  teams: Team[];
  onAddTeam: (name: string, players: string[], rank?: number, color?: string) => void;
  onDeleteTeam: (id: string) => void;
  onUpdateTeam: (team: Team) => void;
  onReset: () => void;
  teamColors: string[];
}

const TeamsManager: React.FC<TeamsManagerProps> = ({ teams, onAddTeam, onDeleteTeam, onUpdateTeam, onReset, teamColors }) => {
  const [name, setName] = useState('');
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [rank, setRank] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState(teamColors[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [editName, setEditName] = useState('');
  const [editP1, setEditP1] = useState('');
  const [editP2, setEditP2] = useState('');
  const [editRank, setEditRank] = useState<string>('');
  const [editColor, setEditColor] = useState('');

  const handleRankChange = (val: string, setter: (v: string) => void) => {
    const cleanVal = val.replace(/\D/g, '');
    setter(cleanVal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && player1.trim()) {
      onAddTeam(
        name, 
        [player1, player2].filter(p => p.trim() !== ''),
        rank ? parseInt(rank) : undefined,
        selectedColor
      );
      setName('');
      setPlayer1('');
      setPlayer2('');
      setRank('');
      setSelectedColor(teamColors[teams.length % teamColors.length]);
    }
  };

  const startEditing = (team: Team) => {
    setEditingId(team.id);
    setEditName(team.name);
    setEditP1(team.players[0] || '');
    setEditP2(team.players[1] || '');
    setEditRank(team.rank?.toString() || '');
    setEditColor(team.color || teamColors[0]);
  };

  const handleSaveEdit = () => {
    if (editingId && editName.trim() && editP1.trim()) {
      onUpdateTeam({
        id: editingId,
        name: editName,
        players: [editP1, editP2].filter(p => p.trim() !== ''),
        rank: editRank ? parseInt(editRank) : undefined,
        color: editColor
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in duration-500">
      <section className="bg-white dark:bg-slate-900 p-5 md:p-8 rounded-[2.5rem] shadow-2xl shadow-slate-300/40 dark:shadow-none border border-slate-200 dark:border-slate-800 transition-all ring-1 ring-slate-100 dark:ring-transparent">
        <div className="flex items-center gap-4 mb-6 md:mb-8">
           <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
             <i className="fa-solid fa-id-badge text-lg md:text-xl"></i>
           </div>
           <div>
              <h2 className="text-xl md:text-2xl font-black text-blue-950 dark:text-white tracking-tight leading-none mb-1 uppercase">Command Center</h2>
              <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest">Register Team Personnel</p>
           </div>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 items-end">
            <div className="md:col-span-4 lg:col-span-5 w-full">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Identity (Team Name)</label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-bold transition-all text-sm shadow-inner"
                placeholder="e.g. Baseline Ballers"
                required
              />
            </div>
            <div className="md:col-span-4 lg:col-span-3 w-full">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Player 1</label>
              <input 
                type="text" 
                value={player1} 
                onChange={e => setPlayer1(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-bold transition-all text-sm shadow-inner"
                placeholder="Primary"
                required
              />
            </div>
            <div className="md:col-span-4 lg:col-span-3 w-full">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1">Player 2</label>
              <input 
                type="text" 
                value={player2} 
                onChange={e => setPlayer2(e.target.value)}
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-bold transition-all text-sm shadow-inner"
                placeholder="Secondary (Optional)"
              />
            </div>
            
            <div className="flex items-end gap-4 md:col-span-12 lg:col-span-1">
              <div className="flex-1 lg:w-20">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 px-1 text-center">Seed</label>
                <input 
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={rank} 
                  onChange={e => handleRankChange(e.target.value, setRank)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none dark:text-white font-black text-center transition-all text-sm shadow-inner"
                  placeholder="-"
                />
              </div>
              <div className="w-auto flex flex-col items-center">
                <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Color</label>
                <div className="relative group w-[52px] h-[52px]">
                  <div className="absolute inset-0 rounded-2xl border-2 border-slate-300 dark:border-slate-700 group-hover:border-emerald-500 transition-colors pointer-events-none shadow-sm"></div>
                  <div 
                    className="absolute inset-1 rounded-[0.9rem] shadow-xl flex items-center justify-center cursor-pointer transition-transform active:scale-95 overflow-hidden"
                    style={{ 
                      background: `conic-gradient(red, yellow, lime, aqua, blue, magenta, red)`, 
                      backgroundColor: selectedColor,
                      backgroundBlendMode: 'soft-light'
                    }}
                  >
                    <input 
                      type="color" 
                      value={selectedColor} 
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                      title="Team Color Palette"
                    />
                    <div className="w-5 h-5 rounded-full border-2 border-white shadow-sm pointer-events-none relative z-10" style={{ backgroundColor: selectedColor }}></div>
                  </div>
                </div>
              </div>
              <div className="flex-1 md:hidden">
                <button 
                  type="submit"
                  className="w-full h-[52px] bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <i className="fa-solid fa-plus text-sm"></i>
                  Add
                </button>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block w-full">
            <button 
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-plus text-sm"></i>
              Register Team
            </button>
          </div>
        </form>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6 md:mb-8 px-2 md:px-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-blue-950 dark:text-white tracking-tighter uppercase">Roster Directory</h2>
            <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">{teams.length} Confirmed Entries</p>
          </div>
        </div>
        
        {teams.length === 0 ? (
          <div className="text-center py-20 md:py-32 bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800/50 flex flex-col items-center shadow-inner px-6 ring-1 ring-slate-100 dark:ring-transparent">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 md:mb-8 text-slate-200 dark:text-slate-700 transition-transform hover:rotate-6">
               <i className="fa-solid fa-user-group text-4xl md:text-5xl"></i>
            </div>
            <h3 className="text-lg md:text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest mb-3">No Active Teams</h3>
            <p className="text-slate-400 dark:text-slate-700 max-w-xs mx-auto text-xs md:text-sm font-medium">Use the command center above to populate the tournament roster.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {teams.sort((a,b) => (a.rank || 99) - (b.rank || 99)).map(team => (
              <div key={team.id} className={`bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 group relative overflow-hidden flex flex-col h-full ring-1 ring-slate-100 dark:ring-transparent ${
                editingId === team.id ? 'border-emerald-500 ring-[8px] md:ring-[12px] ring-emerald-500/10 shadow-2xl' : 'border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-blue-500/30 shadow-xl shadow-slate-300/20 dark:shadow-none'
              }`}>
                <div 
                  className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 opacity-10 blur-3xl rounded-full transition-all group-hover:scale-150"
                  style={{ backgroundColor: team.color }}
                />
                
                {editingId === team.id ? (
                  <div className="space-y-4 flex-1 flex flex-col relative z-10">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-xl border-2 border-slate-200 shadow-sm overflow-hidden flex-shrink-0 relative">
                          <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} className="w-full h-full opacity-0 cursor-pointer" />
                          <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: editColor }}></div>
                       </div>
                       <input 
                        type="text" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)}
                        className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold dark:text-white focus:ring-1 focus:ring-emerald-500 outline-none shadow-inner"
                        placeholder="Team Name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                       <div className="grid grid-cols-1 gap-2">
                         <input 
                          type="text" 
                          value={editP1} 
                          onChange={e => setEditP1(e.target.value)}
                          className="px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-bold focus:ring-1 focus:ring-emerald-500 outline-none shadow-inner"
                          placeholder="P1 Name"
                        />
                        <input 
                          type="text" 
                          value={editP2} 
                          onChange={e => setEditP2(e.target.value)}
                          className="px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-bold focus:ring-1 focus:ring-emerald-500 outline-none shadow-inner"
                          placeholder="P2 Name (Optional)"
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block px-1">Tournament Seed</label>
                        <input 
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={editRank} 
                          onChange={e => handleRankChange(e.target.value, setEditRank)}
                          className="w-full px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white font-black focus:ring-1 focus:ring-emerald-500 outline-none shadow-inner"
                          placeholder="Seed"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 mt-auto">
                      <button onClick={handleSaveEdit} className="flex-1 bg-emerald-600 text-white text-[10px] font-black uppercase py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">Save</button>
                      <button onClick={() => setEditingId(null)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase py-3.5 rounded-xl active:scale-95 transition-all border border-slate-200 dark:border-slate-700">Discard</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-black shadow-2xl shrink-0 transition-transform group-hover:rotate-6 group-hover:scale-110 border border-white/20" style={{ backgroundColor: team.color }}>
                          {team.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                           <h3 className="font-black text-lg md:text-xl text-blue-950 dark:text-slate-100 leading-tight mb-1 truncate">{team.name}</h3>
                           <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[9px] md:text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Ranked #{team.rank || '-'}</span>
                           </div>
                        </div>
                      </div>
                      <div className="flex gap-1.5 ml-2 transition-all transform md:opacity-0 md:translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0">
                        <button onClick={() => startEditing(team)} className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors border border-slate-200 dark:border-slate-700"><i className="fa-solid fa-pen-nib text-[10px] md:text-xs"></i></button>
                        <button onClick={() => onDeleteTeam(team.id)} className="w-8 h-8 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-red-400 hover:text-red-600 transition-colors border border-slate-200 dark:border-slate-700"><i className="fa-solid fa-trash text-[10px] md:text-xs"></i></button>
                      </div>
                    </div>
                    
                    <div className="mt-auto space-y-4 relative z-10">
                       <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
                       <div>
                         <label className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] block mb-2 md:mb-3">Certified Personnel</label>
                         <div className="flex flex-col gap-1.5 md:gap-2">
                            {team.players.map((p, i) => (
                              <div key={i} className="px-3 md:px-4 py-2.5 md:py-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-[11px] md:text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 border border-slate-200/60 dark:border-slate-700 transition-all shadow-sm">
                                 <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center text-[8px] shadow-sm font-black border border-slate-200 dark:border-slate-900/20 text-slate-400 shrink-0">0{i+1}</div>
                                 <span className="truncate">{p}</span>
                              </div>
                            ))}
                         </div>
                       </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TeamsManager;
