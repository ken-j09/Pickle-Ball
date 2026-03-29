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

// ─── Constants ────────────────────────────────────────────────────────────────

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
  // ViewType values must match Sidebar item ids:
  // 'teams' | 'tournament' | 'live-scoring' | 'standings' | 'rules' | 'ai-insights'
  const [activeView, setActiveView] = useState<ViewType>(() => {
    const saved = localStorage.getItem('pickle_view');
    return (saved as ViewType) || 'teams';
  });

  const [tournamentType, setTournamentType] = useState<TournamentType>(() => {
    const saved = localStorage.getItem('pickle_type');
    return (saved as TournamentType) || 'single-round-robin';
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

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchData().then(data => console.log('API data:', data)).catch(console.error);
  }, []);

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

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('pickle_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('pickle_teams', JSON.stringify(teams));
    localStorage.setItem('pickle_matches', JSON.stringify(matches));
    localStorage.setItem('pickle_type', tournamentType);
    if (!isProjectorMode) localStorage.setItem('pickle_view', activeView);
    localStorage.setItem('pickle_active_scorers', JSON.stringify(activeScorerIds));
    localStorage.setItem('pickle_sidebar_collapsed', String(isSidebarCollapsed));
  }, [teams, matches, tournamentType, activeView, activeScorerIds, isProjectorMode, isSidebarCollapsed]);

  useEffect(() => {
    const onHashChange = () => setIsProjectorMode(window.location.hash === '#/projector');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Wallet ─────────────────────────────────────────────────────────────────

  const connectWallet = async () => {
    setWalletError(null);
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
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
      players: [],
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

  // ── Match handlers ─────────────────────────────────────────────────────────

  const handleUpdateMatch = useCallback((updated: Match) => {
    setMatches(prev => prev.map(m => (m.id === updated.id ? updated : m)));

    // Recompute team standings from all matches
    setTeams(prevTeams => {
      const teamMap = new Map(
        prevTeams.map(t => [t.id, { ...t, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 }])
      );
      const allMatches = matches.map(m => (m.id === updated.id ? updated : m));
      for (const match of allMatches) {
        if (match.score1 == null || match.score2 == null || !match.isCompleted) continue;
        const tA = teamMap.get(match.team1Id);
        const tB = teamMap.get(match.team2Id);
        if (!tA || !tB) continue;
        tA.pointsFor += match.score1;
        tA.pointsAgainst += match.score2;
        tB.pointsFor += match.score2;
        tB.pointsAgainst += match.score1;
        if (match.score1 > match.score2) { tA.wins += 1; tB.losses += 1; }
        else if (match.score2 > match.score1) { tB.wins += 1; tA.losses += 1; }
      }
      return Array.from(teamMap.values());
    });
  }, [matches]);

  // ── Move match (for ScheduleManager) ──────────────────────────────────────

  const handleMoveMatch = useCallback((matchId: string, direction: 'up' | 'down') => {
    setMatches(prev => {
      const match = prev.find(m => m.id === matchId);
      if (!match) return prev;
      const roundMatches = prev
        .filter(m => m.round === match.round)
        .sort((a, b) => (a.position || 0) - (b.position || 0));
      const idx = roundMatches.findIndex(m => m.id === matchId);
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= roundMatches.length) return prev;
      const swapped = [...roundMatches];
      [swapped[idx], swapped[swapIdx]] = [swapped[swapIdx], swapped[idx]];
      const updatedPositions = swapped.map((m, i) => ({ ...m, position: i }));
      return prev.map(m => {
        const updated = updatedPositions.find(u => u.id === m.id);
        return updated ?? m;
      });
    });
  }, []);

  const handleReorderMatches = useCallback((round: number, reordered: Match[]) => {
    setMatches(prev => {
      const others = prev.filter(m => m.round !== round);
      return [...others, ...reordered];
    });
  }, []);

  // ── Bracket / schedule generation ─────────────────────────────────────────

  const handleGenerate = useCallback((type: TournamentType) => {
    setTournamentType(type);
    const pool = [...teams].sort(() => Math.random() - 0.5);
    if (pool.length < 2) return;

    const newMatches: Match[] = [];

    if (type === 'single-round-robin') {
      for (let i = 0; i < pool.length; i++) {
        for (let j = i + 1; j < pool.length; j++) {
          newMatches.push({
            id: crypto.randomUUID(),
            team1Id: pool[i].id,
            team2Id: pool[j].id,
            score1: null,
            score2: null,
            round: 1,
            position: newMatches.length,
            bracketType: 'winners',
            court: `Court ${newMatches.length + 1}`,
            isCompleted: false,
            winnerId: null,
          });
        }
      }
    } else if (type === 'round-robin') {
      // Double round robin — play each pair twice
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < pool.length; i++) {
          for (let j = i + 1; j < pool.length; j++) {
            newMatches.push({
              id: crypto.randomUUID(),
              team1Id: pass === 0 ? pool[i].id : pool[j].id,
              team2Id: pass === 0 ? pool[j].id : pool[i].id,
              score1: null,
              score2: null,
              round: pass + 1,
              position: newMatches.length,
              bracketType: 'winners',
              court: `Court ${(newMatches.length % 4) + 1}`,
              isCompleted: false,
              winnerId: null,
            });
          }
        }
      }
    } else {
      // Single / double elimination
      for (let i = 0; i + 1 < pool.length; i += 2) {
        newMatches.push({
          id: crypto.randomUUID(),
          team1Id: pool[i].id,
          team2Id: pool[i + 1].id,
          score1: null,
          score2: null,
          round: 1,
          position: Math.floor(i / 2),
          bracketType: 'winners',
          court: `Court ${Math.floor(i / 2) + 1}`,
          isCompleted: false,
          winnerId: null,
        });
      }
    }

    setMatches(newMatches);
    setTeams(prev => prev.map(t => ({ ...t, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0 })));
    setActiveView('tournament');
  }, [teams]);

  const handleResetTournament = useCallback(() => {
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

  // ── Live scoring handlers ──────────────────────────────────────────────────

  const handleToggleLive = useCallback((matchId: string) => {
    setActiveScorerIds(prev =>
      prev.includes(matchId) ? prev.filter(id => id !== matchId) : [...prev, matchId]
    );
  }, []);

  const handleScoreMatch = useCallback((matchId: string) => {
    setScoringConsoles(prev => {
      if (prev.find(c => c.matchId === matchId)) return prev;
      const z = nextZIndex.current++;
      return [...prev, { matchId, x: 80 + prev.length * 30, y: 80 + prev.length * 30, zIndex: z }];
    });
  }, []);

  const handleCloseScorer = useCallback((matchId: string) => {
    setScoringConsoles(prev => prev.filter(c => c.matchId !== matchId));
  }, []);

  const handleRemoveMatch = useCallback((matchId: string) => {
    setActiveScorerIds(prev => prev.filter(id => id !== matchId));
    setScoringConsoles(prev => prev.filter(c => c.matchId !== matchId));
  }, []);

  const handleFocusConsole = useCallback((matchId: string) => {
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

  const handleLaunchAudience = useCallback(() => {
    window.location.hash = '#/projector';
    setIsProjectorMode(true);
  }, []);

  // ── Derived data ───────────────────────────────────────────────────────────

  // Leaderboard uses teamId to match Sidebar's entry.teamId usage
  const leaderboard: StandingsEntry[] = useMemo(() => {
    return [...teams]
      .map(t => ({
        teamId: t.id,
        wins: t.wins,
        losses: t.losses,
        pointsFor: t.pointsFor,
        pointsAgainst: t.pointsAgainst,
        differential: t.pointsFor - t.pointsAgainst,
      }))
      .sort((a, b) => b.wins - a.wins || b.differential - a.differential);
  }, [teams]);

  const activeMatches = useMemo(
    () => matches.filter(m => activeScorerIds.includes(m.id)),
    [matches, activeScorerIds]
  );

  // ── Projector mode ─────────────────────────────────────────────────────────

  if (isProjectorMode) {
    return (
      <AudienceView
        activeMatches={activeMatches}
        teams={teams}
        onClose={() => {
          window.location.hash = '';
          setIsProjectorMode(false);
        }}
      />
    );
  }

  // ── View router ────────────────────────────────────────────────────────────

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

      case 'tournament':
        return (
          <TournamentDirector
            teams={teams}
            matches={matches}
            type={tournamentType}
            onUpdateMatch={handleUpdateMatch}
            onMoveMatch={handleMoveMatch}
            onReorderMatches={handleReorderMatches}
            onGenerate={handleGenerate}
            activeScorerIds={activeScorerIds}
            onToggleLive={handleToggleLive}
            onResetTournament={() => setIsBracketResetModalOpen(true)}
            isDarkMode={isDarkMode}
            onScoreMatch={handleScoreMatch}
          />
        );

      case 'live-scoring':
        return (
          <LiveScoring
            activeMatches={activeMatches}
            teams={teams}
            onUpdateMatch={handleUpdateMatch}
            onRemoveMatch={handleRemoveMatch}
            onGoToTournament={() => setActiveView('tournament')}
            onScoreMatch={handleScoreMatch}
            onLaunchAudience={handleLaunchAudience}
          />
        );

      case 'standings':
        return (
          <StandingsTable
            teams={teams}
            matches={matches}
          />
        );

      case 'rules':
        return <RulesViewer />;

      case 'ai-insights':
        return (
          <AIInsights
            teams={teams}
            matches={matches}
          />
        );

      default:
        return null;
    }
  };

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">

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

      <main className="flex-1 p-5 md:p-10 overflow-y-auto overflow-x-hidden pb-32 md:pb-20 relative">

        {isOffline && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm font-medium flex items-center gap-2">
            <span>⚠️</span> You are offline. Some features may be unavailable.
          </div>
        )}

        <h1 className="text-4xl font-bold text-blue-950 dark:text-white mb-8">
          Tournament Center
        </h1>

        {renderView()}
      </main>

      {/* Floating SideOutScorer consoles */}
      {scoringConsoles.map(sc => {
        const match = matches.find(m => m.id === sc.matchId);
        if (!match) return null;
        return (
          <SideOutScorer
            key={sc.matchId}
            match={match}
            teams={teams}
            x={sc.x}
            y={sc.y}
            zIndex={sc.zIndex}
            floating
            onUpdate={handleUpdateMatch}
            onClose={() => handleCloseScorer(sc.matchId)}
            onFocus={() => handleFocusConsole(sc.matchId)}
            onPositionChange={(x, y) => handleMoveConsole(sc.matchId, x, y)}
          />
        );
      })}

      <ConfirmationModal
        isOpen={isResetModalOpen}
        title="Reset Everything?"
        message="This will permanently delete all teams, matches, and scores. This action cannot be undone."
        confirmLabel="Reset All"
        onConfirm={handleResetAll}
        onCancel={() => setIsResetModalOpen(false)}
        variant="danger"
      />

      <ConfirmationModal
        isOpen={isBracketResetModalOpen}
        title="Reset Tournament?"
        message="This will clear all matches and scores. Teams will remain. This action cannot be undone."
        confirmLabel="Reset Tournament"
        onConfirm={handleResetTournament}
        onCancel={() => setIsBracketResetModalOpen(false)}
        variant="warning"
      />

    </div>
  );
};

export default App;
