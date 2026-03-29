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
  '#10b981', '#3b82f6', '#ef4444', '#f59e0b',
  '#8b5cf6', '#ec4899', '#06b6d4', '#f97316',
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

  const [scoringConsoles, setScoringConsoles] = useState<ActiveScorer[]>([]);
  const nextZIndex = useRef(200);

  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('pickle_theme') === 'dark');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isBracketResetModalOpen, setIsBracketResetModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => localStorage.getItem('pickle_sidebar_collapsed') === 'true');
  const [lastDeletedTeam, setLastDeletedTeam] = useState<Team | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Fetch API data once on mount
  useEffect(() => {
    fetchData().then(data => console.log('API data:', data)).catch(console.error);
  }, []);

  // Handle online/offline
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

  // Sync dark mode
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('pickle_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Sync localStorage when data changes
  useEffect(() => {
    localStorage.setItem('pickle_teams', JSON.stringify(teams));
    localStorage.setItem('pickle_matches', JSON.stringify(matches));
    localStorage.setItem('pickle_type', tournamentType);
    if (!isProjectorMode) localStorage.setItem('pickle_view', activeView);
    localStorage.setItem('pickle_active_scorers', JSON.stringify(activeScorerIds));
    localStorage.setItem('pickle_sidebar_collapsed', String(isSidebarCollapsed));
  }, [teams, matches, tournamentType, activeView, activeScorerIds, isProjectorMode, isSidebarCollapsed]);

  // Wallet connection
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
      setWalletError("MetaMask not found.");
    }
  };

  // Add your other handlers like handleUpdateMatch, generateBracket, etc.
  // ... (keep all your existing logic here) ...

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
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        leaderboard={[]} // add your leaderboard logic
        teams={teams}
        activeScorerCount={activeScorerIds.length}
        onResetAll={() => setIsResetModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        walletAddress={walletAddress}
        onConnectWallet={connectWallet}
        walletError={walletError}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="flex-1 p-5 md:p-10 overflow-y-auto overflow-x-hidden pb-32 md:pb-20 relative">
        <h1 className="text-4xl font-bold text-blue-950 dark:text-white">Tournament Center</h1>
        {/* Add your main views like TeamsManager, TournamentDirector, etc. */}
      </main>
    </div>
  );
};

export default App;
