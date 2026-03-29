import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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

// ─── Constants ───────────────────────────────────────────────────────────────

const TEAM_COLORS = [
  '#10b981', '#3b82f6', '#ef4444', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveScorer {
  matchId: string;
  x: number;
  y: number;
  zIndex: number;
}

// ─── App ──────────────────────────────────────────────────────────────────────

const App: React.FC = () => {
  // ── Projector / hash mode ──────────────────────────────────────────────────
  const [isProjectorMode, setIsProjectorMode] = useState(
    window.location.hash === '#/projector'
  );

  // ── Persisted UI state ─────────────────────────────────────────────────────
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

  const [scoringConsoles, setScoringConsoles] = useState<ActiveScorer[]>([]);
  const nextZIndex = useRef(200);

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('pickle_theme') === 'dark'
  );

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isBracketResetModalOpen, setIsBracketResetModalOpen] = useState(false);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => localStorage.getItem('pickle_sidebar_collapsed') === 'true'
  );

  const [lastDeletedTeam, setLastDeletedTeam] = useState<Team | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  // ── Wallet ─────────────────────────────────────────────────────────────────
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);

  // ── Network ────────────────────────────────────────────────────────────────
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // ── Effects ────────────────────────────────────────────────────────────────

  // Fetch API data once on mount
  useEffect(() => {
    fetchData()
      .then(data => console.log('API data:', data))
      .catch(console.error);
  }, []);

  // Online / offline detection
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

  // Sync dark mode to DOM
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('pickle_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Persist all state to localStorage
  useEffect(() => {
    localStorage.setItem('pickle_teams', JSON.stringify(teams));
    localStorage.setItem('pickle_matches', JSON.stringify(matches));
    localStorage.setItem('pickle_type', tournamentType);
    if (!isProjectorMode) localStorage.setItem('pickle_view', activeView);
    localStorage.setItem('pickle_active_scorers', JSON.stringify(activeScorerIds));
    localStorage.setItem('pickle_sidebar_collapsed', String(isSidebarCollapsed));
  }, [teams, matches, tournamentType, activeView, activeScorerIds, isProjectorMode, isSidebarCollapsed]);

  // Hash-based projector mode
  useEffect(() => {
    const onHashChange = () => {
      setIsProjectorMode(window.location.hash === '#/projector');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Wallet ─────────────────────────────────────────────────────────────────

  const connectWallet = async () => {
    setWalletError(null);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        setWalletAddress(accounts[0] || null);
      } catch (err: any) {
        setWalletError(err.message || 'Failed to connect wallet.');
      }
    } else {
      setWalletError('MetaMask not found.');
    }
  };

  // ── Team handlers ──────────────────────────────────────────────────────────

  const handleAddTeam = useCallback((name: string) => {
    const newTeam: Team = {
      id: crypto.randomUUID(),
      name,
      color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
      wins: 0,
      losses: 0,
      pointsFor: 0,
      pointsAgainst: 0,
    };
    setTeams(prev => [...prev, newTeam]);
  }, [teams.length]);

  const handleUpdateTeam = useCallback((updated: Team) => {
    setTeams(prev => prev.map(t => (t.id === updated.id ? updated : t)));
  }, []);

  const handleDeleteTeam = useCallback((id: string) => {
    const team = teams.find(t => t.id === id);
    if (!team) return;
    setTeams(prev => prev.filter(t => t.id !== id));
    setLastDeletedTeam(team);
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = window.setTimeout(() => setLastDeletedTeam(null), 5000);
  }, [teams]);

  const handleUndoDelete = useCallback(() => {
    if (lastDeletedTeam) {
      setTeams(prev => [...prev, lastDeletedTeam]);
      setLastDeletedTeam(null);
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    }
  }, [lastDeletedTeam]);

  // ── Match / bracket handlers ───────────────────────────────────────────────

  const handleUpdateMatch = useCallback((updated: Match) => {
    setMatches(prev => prev.map(m => (m.id === updated.id ? updated : m)));

    // Reflect score changes back into team standings
    setTeams(prevTeams => {
      const teamMap = new Map(prevTeams.map(t => ({ ...t })).map(t => [t.id, t]));

      // Reset and recompute from all matches
      for (const t of teamMap.values()) {
        t.wins = 0;
        t.losses = 0;
        t.pointsFor = 0;
        t.pointsAgainst = 0;
      }

      const allMatches = matches.map(m => (m.id === updated.id ? updated : m));

      for (const match of allMatches) {
        if (match.scoreA == null || match.scoreB == null) continue;
        const tA = teamMap.get(match.teamAId);
        const tB = teamMap.get(match.teamBId);
        if (!tA || !tB) continue;

        tA.pointsFor += match.scoreA;
        tA.pointsAgainst += match.scoreB;
        tB.pointsFor += match.scoreB;
        tB.pointsAgainst += match.scoreA;

        if (match.scoreA > match.scoreB) {
          tA.wins += 1;
          tB.losses += 1;
        } else if (match.scoreB > match.scoreA) {
          tB.wins += 1;
          tA.losses += 1;
        }
      }

      return Array.from(teamMap.values());
    });
  }, [matches]);

  const generateBracket = useCallback(() => {
    if (teams.length < 2) return;

    const shuffled = [...teams].sort(() => Math.random() - 0.5);
    const newMatches: Match[] = [];

    if (tournamentType === 'round-robin') {
      for (let i = 0; i < shuffled.length; i++) {
        for (let j = i + 1; j < shuffled.length; j++) {
          newMatches.push({
            id: crypto.randomUUID(),
            teamAId: shuffled[i].id,
            teamBId: shuffled[j].id,
            scoreA: null,
            scoreB: null,
            round: 1,
            court: `Court ${newMatches.length + 1}`,
            status: 'pending',
          });
        }
      }
    } else {
      // Single / double elimination — simple single-elim first round
      for (let i = 0; i < shuffled.length - 1; i += 2) {
        newMatches.push({
          id: crypto.randomUUID(),
          teamAId: shuffled[i].id,
          teamBId: shuffled[i + 1].id,
          scoreA: null,
          scoreB: null,
          round: 1,
          court: `Court ${newMatches.length + 1}`,
          status: 'pending',
        });
      }
    }

    setMatches(newMatches);
    // Reset team stats on new bracket
    setTeams(prev => prev.map(t => ({ ...t, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 })));
    setActiveView('bracket');
  }, [teams, tournamentType]);

  const handleResetBracket = useCallback(() => {
    setMatches([]);
    setActiveScorerIds([]);
    setScoringConsoles([]);
    setIsBracketResetModalOpen(false);
  }, []);

  const handleResetAll = useCallback(() => {
    setTeams([]);
    setMatches([]);
    setActiveScorerIds([]);
    setScoringConsoles([]);
    setLastDeletedTeam(null);
    setIsResetModalOpen(false);
  }, []);

  // ── Live scoring console handlers ──────────────────────────────────────────

  const handleOpenScorer = useCallback((matchId: string) => {
    setActiveScorerIds(prev =>
      prev.includes(matchId) ? prev : [...prev, matchId]
    );
    setScoringConsoles(prev => {
      if (prev.find(c => c.matchId === matchId)) return prev;
      const z = nextZIndex.current++;
      return [...prev, { matchId, x: 80 + prev.length * 30, y: 80 + prev.length * 30, zIndex: z }];
    });
  }, []);

  const handleCloseScorer = useCallback((matchId: string) => {
    setActiveScorerIds(prev => prev.filter(id => id !== matchId));
    setScoringConsoles(prev => prev.filter(c => c.matchId !== matchId));
  }, []);

  const handleBringToFront = useCallback((matchId: string) => {
    const z = nextZIndex.current++;
    setScoringConsoles(prev =>
      prev.map(c => (c.matchId === matchId ? { ...c, zIndex: z } : c))
    );
  }, []);

  const handleMoveConsole = useCallback((matchId: string, x: number, y: number) => {
    setScoringConsoles(prev =>
      prev.map(c => (c.matchId === matchId ? { ...c, x, y } : c))
    );
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────

  const leaderboard: StandingsEntry[] = useMemo(() => {
    return [...teams]
      .map(t => ({
        team: t,
        wins: t.wins,
        losses: t.losses,
        pointDiff: t.pointsFor - t.pointsAgainst,
        pointsFor: t.pointsFor,
      }))
      .sort((a, b) => b.wins - a.wins || b.pointDiff - a.pointDiff);
  }, [teams]);

  // ── Projector / audience mode ──────────────────────────────────────────────

  if (isProjectorMode) {
    return (
      <AudienceView
        activeMatches={matches.filter(m => activeScorerIds.includes(m.id))}
        teams={teams}
        onClose={() => {
          window.location.hash = '';
          setIsProjectorMode(false);
        }}
      />
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────

  const renderView = () => {
    switch (activeView) {
      case 'teams':
        return (
          <TeamsManager
            teams={teams}
            onAddTeam={handleAddTeam}
            onUpdateTeam={handleUpdateTeam}
            onDeleteTeam={handleDeleteTeam}
            onUndoDelete={handleUndoDelete}
            lastDeletedTeam={lastDeletedTeam}
            teamColors={TEAM_COLORS}
          />
        );

      case 'bracket':
        return (
          <TournamentDirector
            teams={teams}
            matches={matches}
            tournamentType={tournamentType}
            onTournamentTypeChange={setTournamentType}
            onGenerateBracket={generateBracket}
            onUpdateMatch={handleUpdateMatch}
            onOpenScorer={handleOpenScorer}
            activeScorerIds={activeScorerIds}
            onResetBracket={() => setIsBracketResetModalOpen(true)}
          />
        );

      case 'live':
        return (
          <LiveScoring
            matches={matches}
            teams={teams}
            activeScorerIds={activeScorerIds}
            onOpenScorer={handleOpenScorer}
            onCloseScorer={handleCloseScorer}
            onUpdateMatch={handleUpdateMatch}
          />
        );

      case 'standings':
        return (
          <StandingsTable
            leaderboard={leaderboard}
            teams={teams}
            matches={matches}
          />
        );

      case 'handbook':
        return <RulesViewer />;

      case 'insights':
        return (
          <AIInsights
            teams={teams}
            matches={matches}
            leaderboard={leaderboard}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        leaderboard={leaderboard}
        teams={teams}
        activeScorerCount={activeScorerIds.length}
        onResetAll={() => setIsResetModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(d => !d)}
        walletAddress={walletAddress}
        onConnectWallet={connectWallet}
        walletError={walletError}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(c => !c)}
      />

      {/* Main content */}
      <main className="flex-1 p-5 md:p-10 overflow-y-auto overflow-x-hidden pb-32 md:pb-20 relative">
        {/* Offline banner */}
        {isOffline && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> You are offline. Some features may be unavailable.
          </div>
        )}

        <h1 className="text-4xl font-bold text-blue-950 dark:text-white mb-8">
          Tournament Center
        </h1>

        {/* Routed view */}
        {renderView()}
      </main>

      {/* Floating SideOut scoring consoles */}
      {scoringConsoles.map(console => {
        const match = matches.find(m => m.id === console.matchId);
        if (!match) return null;
        return (
          <SideOutScorer
            key={console.matchId}
            match={match}
            teams={teams}
            x={console.x}
            y={console.y}
            zIndex={console.zIndex}
            onUpdateMatch={handleUpdateMatch}
            onClose={() => handleCloseScorer(console.matchId)}
            onBringToFront={() => handleBringToFront(console.matchId)}
            onMove={(x, y) => handleMoveConsole(console.matchId, x, y)}
          />
        );
      })}

      {/* Reset all confirmation modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset Everything?"
        message="This will permanently delete all teams, matches, and scores. This action cannot be undone."
        confirmLabel="Reset All"
        onConfirm={handleResetAll}
        onCancel={() => setIsResetModalOpen(false)}
      />

      {/* Reset bracket confirmation modal */}
      <ConfirmationModal
        isOpen={isBracketResetModalOpen}
        title="Reset Bracket?"
        message="This will clear all matches and scores. Teams will remain. This action cannot be undone."
        confirmLabel="Reset Bracket"
        onConfirm={handleResetBracket}
        onCancel={() => setIsBracketResetModalOpen(false)}
      />
    </div>
  );
};

export default App;
