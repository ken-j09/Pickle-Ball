
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchData } from './services/api';
import { Team, Match, ViewType, TournamentType, StandingsEntry } from './types';
import Sidebar from './components/Sidebar';
import TeamsManager from './components/TeamsManager';
import TournamentDirector from './components/TournamentDirector';
import StandingsTable from './components/StandingsTable';
import AIInsights from './components/AIInsights';
import LiveScoring from './components/LiveScoring';
import AudienceView from './components/AudienceView';
import RulesViewer from './components/RulesViewer';
import ConfirmationModal from './components/ConfirmationModal';
import SideOutScorer from './components/SideOutScorer';

const TEAM_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

interface ActiveScorer {
  matchId: string;
  x: number;
  y: number;
  zIndex: number;
}
 
const App: React.FC = () => {
  const [isProjectorMode, setIsProjectorMode] = useState(window.location.hash === '#/projector');
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const saved = localStorage.getItem('pickle_view');
    return (saved as ViewType) || 'teams';
  });
  
  const [tournamentType, setTournamentType] = useState<TournamentType>(() => {
    const saved = localStorage.getItem('pickle_type');
    return (saved as TournamentType) || 'round-robin';
  });
  
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('pickle_teams');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('pickle_matches');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeScorerIds, setActiveScorerIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('pickle_active_scorers');
    return saved ? JSON.parse(saved) : [];
  });

  // Support for multiple simultaneous scoring windows
  const [scoringConsoles, setScoringConsoles] = useState<ActiveScorer[]>([]);
  const nextZIndex = useRef(200);

  // Default to Light Mode (false) if no theme is saved in localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('pickle_theme');
    return saved === 'dark';
  });

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isBracketResetModalOpen, setIsBracketResetModalOpen] = useState(false);
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('pickle_sidebar_collapsed');
    return saved === 'true';
  });

  const [lastDeletedTeam, setLastDeletedTeam] = useState<Team | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const connectWallet = async () => {
    setWalletError(null);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // Check if we are in an iframe
        if (window.self !== window.top) {
          console.warn("MetaMask connection might be restricted in an iframe. If it fails, try opening the app in a new tab.");
        }

        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } catch (err: any) {
        console.error("MetaMask Connection Error:", err);
        if (err.code === 4001) {
          setWalletError("Connection rejected by user.");
        } else if (err.code === -32002) {
          setWalletError("Request already pending. Check MetaMask.");
        } else {
          setWalletError(`Failed to connect: ${err.message || "Unknown error"}`);
        }
      }
    } else {
      setWalletError("MetaMask not found. Please install the extension.");
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
        } else {
          setWalletAddress(null);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);

      // Check if already connected
      (window as any).ethereum.request({ method: 'eth_accounts' })
        .then(handleAccountsChanged)
        .catch(console.error);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'pickle_matches' && e.newValue) setMatches(JSON.parse(e.newValue));
      if (e.key === 'pickle_teams' && e.newValue) setTeams(JSON.parse(e.newValue));
      if (e.key === 'pickle_active_scorers' && e.newValue) setActiveScorerIds(JSON.parse(e.newValue));
      if (e.key === 'pickle_theme' && e.newValue) setIsDarkMode(e.newValue === 'dark');
    };

    const handleHashChange = () => {
      setIsProjectorMode(window.location.hash === '#/projector');
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pickle_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pickle_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('pickle_teams', JSON.stringify(teams));
    localStorage.setItem('pickle_matches', JSON.stringify(matches));
    localStorage.setItem('pickle_type', tournamentType);
    if (!isProjectorMode) localStorage.setItem('pickle_view', activeView);
    localStorage.setItem('pickle_active_scorers', JSON.stringify(activeScorerIds));
    localStorage.setItem('pickle_sidebar_collapsed', String(isSidebarCollapsed));
  }, [teams, matches, tournamentType, activeView, activeScorerIds, isProjectorMode, isSidebarCollapsed]);

  const tournamentProgress = useMemo(() => {
    if (matches.length === 0) return 0;
    const completed = matches.filter(m => m.isCompleted).length;
    return Math.round((completed / matches.length) * 100);
  }, [matches]);

  const leaderboard = useMemo(() => {
    const data: Record<string, StandingsEntry> = {};
    teams.forEach(t => {
      data[t.id] = { teamId: t.id, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, differential: 0 };
    });
    matches.filter(m => m.isCompleted).forEach(m => {
      if (m.team1Id && m.team2Id && data[m.team1Id] && data[m.team2Id]) {
        const s1 = m.score1 || 0;
        const s2 = m.score2 || 0;
        data[m.team1Id].pointsFor += s1;
        data[m.team1Id].pointsAgainst += s2;
        if (s1 > s2) data[m.team1Id].wins++; else if (s2 > s1) data[m.team1Id].losses++;
        data[m.team2Id].pointsFor += s2;
        data[m.team2Id].pointsAgainst += s1;
        if (s2 > s1) data[m.team2Id].wins++; else if (s1 > s2) data[m.team2Id].losses++;
      }
    });
    return Object.values(data)
      .sort((a, b) => b.wins - a.wins || (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst))
      .slice(0, 3);
  }, [teams, matches]);

  const toggleLiveScorer = (id: string) => {
    setActiveScorerIds(prev => 
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleUpdateMatch = (updatedMatch: Match) => {
    const newMatches = matches.map(m => m.id === updatedMatch.id ? updatedMatch : m);
    if (updatedMatch.isCompleted) {
      if (updatedMatch.winnerId && updatedMatch.nextMatchId) {
        const nextIdx = newMatches.findIndex(m => m.id === updatedMatch.nextMatchId);
        if (nextIdx !== -1) {
          const nextMatch = { ...newMatches[nextIdx] };
          if (updatedMatch.bracketType === 'finals') {
             if (updatedMatch.id.includes('-W-')) nextMatch.team1Id = updatedMatch.winnerId;
             else nextMatch.team2Id = updatedMatch.winnerId;
          } else {
             if ((updatedMatch.position || 0) % 2 === 0) nextMatch.team1Id = updatedMatch.winnerId;
             else nextMatch.team2Id = updatedMatch.winnerId;
          }
          newMatches[nextIdx] = nextMatch;
        }
      }
      const loserId = updatedMatch.team1Id === updatedMatch.winnerId ? updatedMatch.team2Id : updatedMatch.team1Id;
      if (loserId && updatedMatch.nextLoserMatchId) {
        const nextLoserIdx = newMatches.findIndex(m => m.id === updatedMatch.nextLoserMatchId);
        if (nextLoserIdx !== -1) {
          const nextMatch = { ...newMatches[nextLoserIdx] };
          if (!nextMatch.team1Id) nextMatch.team1Id = loserId;
          else if (!nextMatch.team2Id) nextMatch.team2Id = loserId;
          newMatches[nextLoserIdx] = nextMatch;
        }
      }
    }
    setMatches(newMatches);
  };

  const handleOpenScorer = (matchId: string) => {
    if (scoringConsoles.some(c => c.matchId === matchId)) return;
    
    // Staggered positioning logic
    const offset = scoringConsoles.length * 30;
    const isMobile = window.innerWidth < 1024;
    const initialX = isMobile ? 16 : window.innerWidth - 450 - offset;
    const initialY = isMobile ? window.innerHeight - 560 - offset : 100 + offset;

    setScoringConsoles(prev => [...prev, {
      matchId,
      x: initialX,
      y: initialY,
      zIndex: nextZIndex.current++
    }]);
  };

  const handleCloseScorer = (matchId: string) => {
    setScoringConsoles(prev => prev.filter(c => c.matchId !== matchId));
  };

  const handleFocusScorer = (matchId: string) => {
    setScoringConsoles(prev => prev.map(c => 
      c.matchId === matchId ? { ...c, zIndex: nextZIndex.current++ } : c
    ));
  };

  const handleUpdateScorerPos = (matchId: string, x: number, y: number) => {
    setScoringConsoles(prev => prev.map(c => 
      c.matchId === matchId ? { ...c, x, y } : c
    ));
  };

  const generateRoundRobin = (legs: number = 1) => {
    if (teams.length < 2) return;
    const newMatches: Match[] = [];
    const teamIds = teams.map(t => t.id);
    let idCounter = 1;
    for (let l = 1; l <= legs; l++) {
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
          newMatches.push({
            id: `rr-${l}-${idCounter++}`, round: l, leg: l as 1 | 2,
            team1Id: teamIds[i], team2Id: teamIds[j], score1: null, score2: null,
            winnerId: null, isCompleted: false
          });
        }
      }
    }
    setMatches(newMatches);
  };

  const generateBracket = (isDoubleElim: boolean) => {
    const numTeams = teams.length;
    if (numTeams < 2) return;
    const size = Math.pow(2, Math.ceil(Math.log2(numTeams)));
    const newMatches: Match[] = [];
    const sortedTeams = [...teams].sort((a, b) => (a.rank || 99) - (b.rank || 99));

    if (!isDoubleElim) {
      const roundsCount = Math.log2(size);
      for (let r = 0; r < roundsCount; r++) {
        const matchesInRound = Math.pow(2, roundsCount - r - 1);
        for (let i = 0; i < matchesInRound; i++) {
          newMatches.push({
            id: `S-R${r}-M${i}`, round: r, position: i, bracketType: 'winners',
            team1Id: r === 0 ? (sortedTeams[i] ? sortedTeams[i].id : null) : null,
            team2Id: r === 0 ? (sortedTeams[size - 1 - i] ? sortedTeams[size - 1 - i].id : null) : null,
            score1: null, score2: null, winnerId: null, isCompleted: false,
            nextMatchId: r === roundsCount - 1 ? null : `S-R${r + 1}-M${Math.floor(i / 2)}`
          });
        }
      }
    } else {
      const roundsCount = Math.log2(size);
      for (let r = 0; r < roundsCount; r++) {
        const matchesInRound = Math.pow(2, roundsCount - r - 1);
        for (let i = 0; i < matchesInRound; i++) {
          newMatches.push({
            id: `W-R${r}-M${i}`, round: r, position: i, bracketType: 'winners',
            team1Id: r === 0 ? (sortedTeams[i*2]?.id || null) : null,
            team2Id: r === 0 ? (sortedTeams[i*2+1]?.id || null) : null,
            score1: null, score2: null, winnerId: null, isCompleted: false,
            nextMatchId: `W-R${r + 1}-M${Math.floor(i / 2)}`,
            nextLoserMatchId: `L-R${r}-M${i}`
          });
        }
      }
      newMatches.push({
        id: `F-R${roundsCount}-M0`, round: roundsCount, position: 0, bracketType: 'finals',
        team1Id: null, team2Id: null, score1: null, score2: null, winnerId: null, isCompleted: false
      });
    }
    setMatches(newMatches);
  };

  const handleGenerateMatches = (type: TournamentType) => {
    setTournamentType(type);
    if (type === 'round-robin') generateRoundRobin(2);
    else if (type === 'single-round-robin') generateRoundRobin(1);
    else generateBracket(type === 'double-elimination');
  };

  const handleLaunchAudience = () => {
    const url = window.location.origin + window.location.pathname + '#/projector';
    window.open(url, '_blank');
  };

  const handleResetEverything = () => {
    setTeams([]);
    setMatches([]);
    setActiveScorerIds([]);
    setScoringConsoles([]);
    setTournamentType('round-robin');
    setActiveView('teams');
    setIsResetModalOpen(false);
    setLastDeletedTeam(null);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
  };

  const handleResetTournament = () => {
    setMatches([]);
    setActiveScorerIds([]);
    setScoringConsoles([]);
    setIsBracketResetModalOpen(false);
  };

  const renderHeaderActions = () => {
    const hasData = teams.length > 0 || matches.length > 0;
    
    return (
      <div className="relative z-30 pointer-events-auto flex flex-wrap lg:flex-nowrap items-center gap-3 md:gap-4 mt-4 lg:mt-0">
        {activeView === 'tournament' && matches.length > 0 && (
          <button onClick={() => setIsBracketResetModalOpen(true)} className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-xs font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-500 rounded-xl transition-all border border-slate-200 dark:border-blue-900/50 shadow-sm"><i className="fa-solid fa-rotate-left"></i> Reset Match Flow</button>
        )}
        {activeView === 'live-scoring' && activeScorerIds.length > 0 && (
          <button onClick={() => setActiveScorerIds([])} className="flex items-center gap-2 px-4 py-3 min-h-[44px] text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 hover:bg-blue-900 dark:hover:bg-slate-700 hover:text-white rounded-xl transition-all border border-slate-200 dark:border-slate-700 shadow-sm"><i className="fa-solid fa-rectangle-xmark"></i> Clear All Courts</button>
        )}

        {/* Theme Toggle - Positioned next to Global Reset for Mobile/Tablet accessibility */}
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="md:hidden flex items-center justify-center w-[44px] h-[44px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all shadow-sm active:scale-95"
          title="Toggle Theme"
        >
          <i className={`fa-solid ${isDarkMode ? 'fa-sun text-amber-500' : 'fa-moon text-indigo-500'}`}></i>
        </button>

        {hasData && (
          <button onClick={() => setIsResetModalOpen(true)} className="flex items-center gap-2 px-5 md:px-6 py-3 min-h-[44px] text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/20 rounded-xl transition-all active:scale-95"><i className="fa-solid fa-fire-flame-curved"></i> Global Reset</button>
        )}
      </div>
    );
  };

  if (isProjectorMode) {
    return (
      <AudienceView 
        activeMatches={matches.filter(m => activeScorerIds.includes(m.id))}
        teams={teams}
        onClose={() => { window.location.hash = ''; setIsProjectorMode(false); }}
      />
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <Sidebar 
        activeView={activeView} onViewChange={setActiveView} leaderboard={leaderboard}
        teams={teams} activeScorerCount={activeScorerIds.length} onResetAll={() => setIsResetModalOpen(true)}
        isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        walletAddress={walletAddress} onConnectWallet={connectWallet} walletError={walletError}
        isCollapsed={isSidebarCollapsed} onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      {isOffline && (
        <div className="fixed bottom-24 md:bottom-8 right-8 z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-bold text-sm">
            <i className="fas fa-wifi-slash"></i>
            <span>Offline Mode Enabled</span>
          </div>
        </div>
      )}
      
      <main className="flex-1 p-5 md:p-10 overflow-y-auto overflow-x-hidden pb-32 md:pb-20 relative">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-3 mb-3">
               <h1 className="text-2xl md:text-4xl font-black text-blue-950 dark:text-white tracking-tight truncate uppercase">
                Tournament <span className="text-emerald-500">Center</span>
              </h1>
              {matches.length > 0 && (
                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold flex items-center gap-2 shrink-0 border border-emerald-200 dark:border-emerald-800">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  {tournamentProgress}% Complete
                </div>
              )}
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden max-w-md border border-slate-300/50 dark:border-slate-800">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                style={{ width: `${tournamentProgress}%` }}
              ></div>
            </div>
          </div>
          
          {renderHeaderActions()}
        </header>

        <div className="max-w-7xl mx-auto">
          {activeView === 'teams' && <TeamsManager teams={teams} onAddTeam={(n, p, r, c) => setTeams([...teams, {id: crypto.randomUUID(), name: n, players: p, rank: r, color: c || TEAM_COLORS[teams.length % TEAM_COLORS.length]}])} onDeleteTeam={id => setTeams(teams.filter(t => t.id !== id))} onUpdateTeam={ut => setTeams(teams.map(t => t.id === ut.id ? ut : t))} onReset={() => setIsResetModalOpen(true)} teamColors={TEAM_COLORS} />}
          {activeView === 'tournament' && <TournamentDirector teams={teams} matches={matches} type={tournamentType} onUpdateMatch={handleUpdateMatch} onMoveMatch={(id, dir) => {}} onReorderMatches={(r, m) => {}} onGenerate={handleGenerateMatches} activeScorerIds={activeScorerIds} onToggleLive={toggleLiveScorer} onResetTournament={() => setIsBracketResetModalOpen(true)} isDarkMode={isDarkMode} onScoreMatch={handleOpenScorer} />}
          {activeView === 'standings' && <StandingsTable teams={teams} matches={matches} />}
          {activeView === 'ai-insights' && <AIInsights teams={teams} matches={matches} />}
          {activeView === 'rules' && <RulesViewer />}
          {activeView === 'live-scoring' && <LiveScoring activeMatches={matches.filter(m => activeScorerIds.includes(m.id))} teams={teams} onUpdateMatch={handleUpdateMatch} onRemoveMatch={toggleLiveScorer} onGoToTournament={() => setActiveView('tournament')} onScoreMatch={handleOpenScorer} onLaunchAudience={handleLaunchAudience} />}
        </div>

        {/* Dynamic Multi-Window Scoring Consoles */}
        {scoringConsoles.map(console => {
          const match = matches.find(m => m.id === console.matchId);
          if (!match) return null;
          return (
            <SideOutScorer 
              key={console.matchId}
              match={match}
              teams={teams}
              onUpdate={handleUpdateMatch}
              onClose={() => handleCloseScorer(console.matchId)}
              floating
              x={console.x}
              y={console.y}
              zIndex={console.zIndex}
              onPositionChange={(x, y) => handleUpdateScorerPos(console.matchId, x, y)}
              onFocus={() => handleFocusScorer(console.matchId)}
            />
          );
        })}
      </main>

      {lastDeletedTeam && (
        <div className="fixed bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-sm animate-in slide-in-from-bottom-8 duration-500">
           <div className="bg-blue-950 dark:bg-slate-900 border border-blue-900 dark:border-slate-800 rounded-3xl p-5 shadow-2xl flex items-center justify-between gap-4 overflow-hidden relative">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: lastDeletedTeam.color }}><i className="fa-solid fa-trash-can-arrow-up"></i></div>
                 <div><h4 className="text-[10px] font-black uppercase text-blue-400 tracking-widest mb-0.5">Team Deleted</h4><p className="text-xs font-bold text-white truncate max-w-[120px]">{lastDeletedTeam.name}</p></div>
              </div>
              <button onClick={() => { setTeams(p => [...p, lastDeletedTeam]); setLastDeletedTeam(null); }} className="bg-emerald-500 hover:bg-emerald-400 text-white text-[10px] font-black uppercase px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"><i className="fa-solid fa-rotate-left"></i> Restore</button>
              <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 animate-shrink-width" style={{ animationDuration: '6s', animationTimingFunction: 'linear' }}></div>
           </div>
        </div>
      )}

      <ConfirmationModal isOpen={isResetModalOpen} title="Destroy All Data?" message="This will wipe everything. It cannot be undone." confirmLabel="Wipe Data" onConfirm={handleResetEverything} onCancel={() => setIsResetModalOpen(false)} />
      <ConfirmationModal isOpen={isBracketResetModalOpen} title="Reset Brackets?" message="Scores will be deleted, but team list remains." confirmLabel="Clear Matches" onConfirm={handleResetTournament} onCancel={() => setIsBracketResetModalOpen(false)} variant="warning" />
    </div>
  );
};

export default App;
