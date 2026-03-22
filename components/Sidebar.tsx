
import React from 'react';
import { ViewType, StandingsEntry, Team } from '../types';

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
  leaderboard: StandingsEntry[];
  teams: Team[];
  activeScorerCount: number;
  onResetAll: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  walletAddress: string | null;
  onConnectWallet: () => void;
  walletError: string | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  leaderboard, 
  teams, 
  activeScorerCount, 
  onResetAll,
  isDarkMode,
  onToggleTheme,
  walletAddress,
  onConnectWallet,
  walletError,
  isCollapsed,
  onToggleCollapse
}) => {
  const items = [
    { id: 'teams', label: 'Roster', icon: 'fa-users-rectangle' },
    { id: 'tournament', label: 'Bracket', icon: 'fa-trophy' },
    { id: 'live-scoring', label: 'Live', icon: 'fa-circle-dot', badge: activeScorerCount },
    { id: 'standings', label: 'Standings', icon: 'fa-list-ol' },
    { id: 'rules', label: 'Handbook', icon: 'fa-book-open' },
    { id: 'ai-insights', label: 'Insights', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <>
      {/* Desktop Vertical Sidebar */}
      <aside className={`hidden md:flex ${isCollapsed ? 'w-24' : 'w-72'} bg-blue-950 dark:bg-slate-950 text-white flex-col transition-all duration-500 border-r border-blue-900/50 z-50 shrink-0 overflow-hidden`}>
        <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 shrink-0">
            <i className="fa-solid fa-table-tennis-paddle-ball text-2xl text-white"></i>
          </div>
          {!isCollapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
               <span className="block font-black text-2xl tracking-tighter leading-none text-white">PicklePro</span>
               <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">v2.1 Stable</span>
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-3">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-5 px-5'} py-4 rounded-[1.25rem] transition-all relative group ${
                activeView === item.id 
                  ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-900/40' 
                  : 'text-blue-300/60 hover:bg-blue-900/40 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="w-8 flex justify-center shrink-0">
                 <i className={`fa-solid ${item.icon} text-lg transition-all ${
                   activeView === item.id ? 'scale-110' : 'group-hover:scale-110'
                 } ${item.id === 'live-scoring' && activeScorerCount > 0 ? 'animate-pulse text-red-400' : ''}`}></i>
              </div>
              {!isCollapsed && (
                <span className="font-black text-sm uppercase tracking-wide truncate animate-in fade-in slide-in-from-left-2 duration-300">
                  {item.label}
                </span>
              )}
              
              {activeView === item.id && (
                <div className="absolute inset-0 bg-white/10 rounded-[1.25rem] blur-xl -z-10 animate-pulse"></div>
              )}

              {item.badge !== undefined && item.badge > 0 && (
                <span className={`${isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-blue-950`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className={`p-6 mt-auto space-y-6 ${isCollapsed ? 'items-center' : ''}`}>
          {!isCollapsed && (
            <>
              <div className="bg-blue-900/20 rounded-[1.5rem] p-6 border border-blue-900/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                   <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">Web3 Wallet</h4>
                   <div className={`w-1.5 h-1.5 rounded-full ${walletAddress ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                </div>
                
                {walletAddress ? (
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Connected</span>
                    <span className="text-[11px] font-mono text-blue-100 truncate">{walletAddress}</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={onConnectWallet}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-wallet"></i>
                      Connect MetaMask
                    </button>
                    {walletError && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-red-400 uppercase tracking-tight text-center">{walletError}</p>
                        {window.self !== window.top && (
                          <p className="text-[8px] font-medium text-slate-400 text-center leading-tight">
                            MetaMask may be blocked in this preview. Try opening the app in a <a href={window.location.href} target="_blank" rel="noreferrer" className="text-blue-400 underline">new tab</a>.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-blue-900/20 rounded-[1.5rem] p-6 border border-blue-900/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between mb-5">
                   <h4 className="text-[10px] font-black uppercase text-blue-400 tracking-[0.2em]">Live Rank</h4>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                </div>
                <div className="space-y-5">
                  {leaderboard.length === 0 ? (
                    <p className="text-[10px] text-blue-700 font-bold uppercase italic tracking-widest">No match data...</p>
                  ) : (
                    leaderboard.map((entry, i) => {
                      const team = teams.find(t => t.id === entry.teamId);
                      return (
                        <div key={entry.teamId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center font-black text-[10px] border border-blue-800 text-blue-400">
                              {i + 1}
                            </div>
                            <span className="text-xs font-bold text-blue-100 truncate">{team?.name}</span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-500 shrink-0 ml-2">{entry.wins}W</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}

          <div className={`flex ${isCollapsed ? 'flex-col' : 'gap-2'}`}>
            <button 
              onClick={onToggleCollapse} 
              className={`flex-1 h-12 flex items-center justify-center bg-blue-900/30 rounded-2xl text-blue-400 hover:text-white transition-all border border-transparent hover:border-blue-800 ${isCollapsed ? 'w-12 mb-2' : ''}`}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <i className={`fa-solid ${isCollapsed ? 'fa-indent' : 'fa-outdent'}`}></i>
            </button>
            <button 
              onClick={onToggleTheme} 
              className={`flex-1 h-12 flex items-center justify-center bg-blue-900/30 rounded-2xl text-blue-400 hover:text-white transition-all border border-transparent hover:border-blue-800 ${isCollapsed ? 'w-12 mb-2' : ''}`}
              title="Toggle Theme"
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon text-indigo-400'}`}></i>
            </button>
            <button 
              onClick={onResetAll} 
              className={`flex-1 h-12 flex items-center justify-center bg-red-500/10 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all border border-transparent hover:border-red-500/30 ${isCollapsed ? 'w-12' : ''}`}
              title="Global Reset"
            >
              <i className="fa-solid fa-power-off"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-blue-950/90 dark:bg-slate-950/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-4 py-3 safe-area-pb shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className="relative flex flex-col items-center gap-1 min-w-[50px] transition-all active:scale-90"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              activeView === item.id 
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/40' 
                : 'text-blue-300/50'
            }`}>
              <i className={`fa-solid ${item.icon} text-lg ${
                item.id === 'live-scoring' && activeScorerCount > 0 && activeView !== item.id ? 'animate-pulse text-red-400' : ''
              }`}></i>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${
              activeView === item.id ? 'text-emerald-400' : 'text-blue-300/30'
            }`}>
              {item.label}
            </span>

            {item.badge !== undefined && item.badge > 0 && (
              <span className="absolute -top-1 right-0 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-blue-950">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </>
  );
};

export default Sidebar;
