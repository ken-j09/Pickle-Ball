
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Match, Team } from '../types';

type TieBreakerRule = 'standard' | 'hard-cap' | 'golden-point';
type ScoringMode = 'side-out' | 'rally';
type TargetScore = 11 | 15 | 21;

interface ScorerState {
  s1: number;
  s2: number;
  servingTeam: 1 | 2;
  serverNum: 1 | 2;
  isFirstServeOfGame: boolean;
  isDoubles: boolean;
  tieBreakerRule: TieBreakerRule;
  scoringMode: ScoringMode;
  targetScore: TargetScore;
}

interface SideOutScorerProps {
  match: Match;
  teams: Team[];
  onUpdate: (match: Match) => void;
  onClose?: () => void;
  inline?: boolean;
  floating?: boolean;
  x?: number;
  y?: number;
  zIndex?: number;
  onPositionChange?: (x: number, y: number) => void;
  onFocus?: () => void;
}

const SideOutScorer: React.FC<SideOutScorerProps> = ({ 
  match, teams, onUpdate, onClose, inline, floating, 
  x = 100, y = 100, zIndex = 200, onPositionChange, onFocus 
}) => {
  const [s1, setS1] = useState(match.score1 || 0);
  const [s2, setS2] = useState(match.score2 || 0);
  const [isDoubles, setIsDoubles] = useState(true);
  const [servingTeam, setServingTeam] = useState<1 | 2>(1);
  const [serverNum, setServerNum] = useState<1 | 2>(2);
  const [isFirstServeOfGame, setIsFirstServeOfGame] = useState(true);
  const [tieBreakerRule, setTieBreakerRule] = useState<TieBreakerRule>('standard');
  const [scoringMode, setScoringMode] = useState<ScoringMode>('side-out');
  const [targetScore, setTargetScore] = useState<TargetScore>(11);
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Detect if device is Desktop for dragging functionality
  const [isDraggableDevice, setIsDraggableDevice] = useState(window.innerWidth >= 1024);
  
  const [history, setHistory] = useState<ScorerState[]>([]);
  
  // Dragging logic
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const team1 = teams.find(t => t.id === match.team1Id);
  const team2 = teams.find(t => t.id === match.team2Id);

  useEffect(() => {
    const handleResize = () => setIsDraggableDevice(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Bring window to front on any click/tap
    if (onFocus) onFocus();
    
    // Only allow dragging if on a desktop-sized device
    if (!isDraggableDevice) return;

    const target = e.target as HTMLElement;
    // Only drag from the header
    if (!target.closest('.drag-handle')) return;
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: x,
      initialY: y
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !isDraggableDevice) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaY = e.clientY - dragRef.current.startY;
    if (onPositionChange) {
      onPositionChange(dragRef.current.initialX + deltaX, dragRef.current.initialY + deltaY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const checkWinner = useCallback(() => {
    if (tieBreakerRule === 'standard') {
      return (s1 >= targetScore && s1 - s2 >= 2) || (s2 >= targetScore && s2 - s1 >= 2);
    } else if (tieBreakerRule === 'hard-cap') {
      return s1 >= targetScore + 4 || s2 >= targetScore + 4;
    } else if (tieBreakerRule === 'golden-point') {
      return s1 !== s2 && (s1 >= targetScore || s2 >= targetScore);
    }
    return false;
  }, [s1, s2, tieBreakerRule, targetScore]);

  const hasWinner = checkWinner();

  useEffect(() => {
    const p1Count = team1?.players.length || 0;
    const p2Count = team2?.players.length || 0;
    const likelyDoubles = p1Count > 1 || p2Count > 1;
    setIsDoubles(likelyDoubles);
    if (!likelyDoubles) { setServerNum(1); setIsFirstServeOfGame(false); }
    else { setServerNum(2); setIsFirstServeOfGame(true); }
  }, [team1, team2]);

  const saveToHistory = useCallback(() => {
    const currentState: ScorerState = { s1, s2, servingTeam, serverNum, isFirstServeOfGame, isDoubles, tieBreakerRule, scoringMode, targetScore };
    setHistory(prev => [...prev, currentState]);
  }, [s1, s2, servingTeam, serverNum, isFirstServeOfGame, isDoubles, tieBreakerRule, scoringMode, targetScore]);

  const handleProPoint = () => {
    if (hasWinner) return; 
    saveToHistory();
    if (servingTeam === 1) setS1(prev => prev + 1);
    else setS2(prev => prev + 1);
  };

  const handleProFault = () => {
    if (hasWinner) return;
    saveToHistory();
    if (scoringMode === 'rally') {
      if (servingTeam === 1) setS2(prev => prev + 1);
      else setS1(prev => prev + 1);
    }
    if (!isDoubles) {
      setServingTeam(servingTeam === 1 ? 2 : 1);
      setServerNum(1);
    } else {
      if (isFirstServeOfGame) { setServingTeam(2); setServerNum(1); setIsFirstServeOfGame(false); }
      else if (serverNum === 1) { setServerNum(2); }
      else { setServingTeam(servingTeam === 1 ? 2 : 1); setServerNum(1); }
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    setS1(lastState.s1);
    setS2(lastState.s2);
    setServingTeam(lastState.servingTeam);
    setServerNum(lastState.serverNum);
    setIsFirstServeOfGame(lastState.isFirstServeOfGame);
    setIsDoubles(lastState.isDoubles);
    setTieBreakerRule(lastState.tieBreakerRule);
    setScoringMode(lastState.scoringMode);
    setTargetScore(lastState.targetScore);
  };

  const handleFinalize = () => {
    const winnerId = hasWinner ? (s1 > s2 ? match.team1Id : match.team2Id) : null;
    onUpdate({ ...match, score1: s1, score2: s2, winnerId: winnerId, isCompleted: hasWinner });
    if (onClose) onClose();
  };

  const scoreCall = servingTeam === 1 ? `${s1}-${s2}-${isDoubles ? serverNum : ''}` : `${s2}-${s1}-${isDoubles ? serverNum : ''}`;

  if (isMinimized && floating) {
    return (
      <div 
        style={{ left: `${x}px`, top: `${y}px`, zIndex }}
        className={`fixed bg-blue-950 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 border border-blue-800 animate-in slide-in-from-right-8 ${isDraggableDevice ? 'cursor-grab active:cursor-grabbing drag-handle' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-xs">{s1}:{s2}</div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 leading-none mb-1">Station {match.id.slice(-1)}</p>
            <p className="text-xs font-bold truncate max-w-[120px]">{team1?.name} vs {team2?.name}</p>
          </div>
        </div>
        <button onClick={() => setIsMinimized(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"><i className="fa-solid fa-expand text-xs"></i></button>
      </div>
    );
  }

  const containerStyle: React.CSSProperties = floating ? { 
    position: 'fixed', left: `${x}px`, top: `${y}px`, zIndex,
    width: window.innerWidth < 768 ? 'calc(100% - 2rem)' : '400px',
  } : {};

  return (
    <div 
      className={`bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col transition-shadow ${floating ? 'animate-in fade-in zoom-in-95' : ''}`}
      style={containerStyle}
      onPointerDown={() => onFocus?.()}
    >
      <div 
        className={`p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 shrink-0 ${isDraggableDevice ? 'cursor-grab active:cursor-grabbing drag-handle' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-950 flex items-center justify-center text-white"><i className="fa-solid fa-gamepad text-xs"></i></div>
          <div>
            <h3 className="font-black text-blue-950 dark:text-white uppercase tracking-wider text-xs">Controller</h3>
            <p className="text-[8px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{scoringMode} • {targetScore} goal</p>
          </div>
        </div>
        <div className="flex gap-1.5" onPointerDown={e => e.stopPropagation()}>
          {floating && (
            <button onClick={() => setIsMinimized(true)} className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-blue-500 transition-all"><i className="fa-solid fa-minus text-[10px]"></i></button>
          )}
          <button onClick={() => setShowSettings(!showSettings)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${showSettings ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-emerald-500'}`}><i className="fa-solid fa-sliders text-[10px]"></i></button>
          {onClose && (
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-slate-700 hover:text-red-500 transition-all"><i className="fa-solid fa-xmark text-xs"></i></button>
          )}
        </div>
      </div>

      <div className="p-6 flex flex-col max-h-[500px] overflow-y-auto no-scrollbar">
        {showSettings && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 animate-in slide-in-from-top-2">
             <div className="space-y-4">
               <div>
                 <label className="block text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 px-1">Target Score</label>
                 <div className="grid grid-cols-3 gap-2">
                    {[11, 15, 21].map(score => (
                      <button key={score} onClick={() => { saveToHistory(); setTargetScore(score as TargetScore); }} className={`py-1.5 rounded-lg text-[10px] font-black border transition-all ${targetScore === score ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>{score}</button>
                    ))}
                 </div>
               </div>
               <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 px-1">Mode</label>
                    <select value={scoringMode} onChange={e => { saveToHistory(); setScoringMode(e.target.value as ScoringMode); }} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-2 text-[9px] font-black uppercase">
                      <option value="side-out">Side-Out</option><option value="rally">Rally</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[8px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 px-1">Rule</label>
                    <select value={tieBreakerRule} onChange={e => { saveToHistory(); setTieBreakerRule(e.target.value as TieBreakerRule); }} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-2 text-[9px] font-black uppercase">
                      <option value="standard">Std</option><option value="hard-cap">Cap</option><option value="golden-point">G.Pt</option>
                    </select>
                  </div>
               </div>
             </div>
          </div>
        )}

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6 relative">
          <button onClick={() => { saveToHistory(); setIsDoubles(true); if (isFirstServeOfGame) setServerNum(2); }} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all z-10 ${isDoubles ? 'text-blue-950 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>Doubles</button>
          <button onClick={() => { saveToHistory(); setIsDoubles(false); setServerNum(1); setIsFirstServeOfGame(false); }} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all z-10 ${!isDoubles ? 'text-blue-950 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>Singles</button>
          <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-slate-700 rounded-lg shadow-sm transition-all transform ${isDoubles ? 'translate-x-0' : 'translate-x-full'}`} />
        </div>

        <div className="bg-blue-950 dark:bg-black rounded-3xl p-6 text-white relative overflow-hidden shadow-xl mb-6">
          <div className="flex justify-between items-center relative z-10">
            <div className={`text-center transition-all ${servingTeam === 1 ? 'scale-110' : 'opacity-20'}`}>
              <p className="text-[8px] font-black text-emerald-400 uppercase mb-2 truncate w-20">{team1?.name}</p>
              <p className="text-5xl font-black tracking-tighter tabular-nums">{s1}</p>
            </div>
            <div className="text-center flex flex-col items-center">
               <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-3 ${hasWinner ? 'bg-amber-500 text-white' : 'bg-white/10 text-white/50'}`}>{hasWinner ? 'Done' : isDoubles ? `S${serverNum}` : 'Live'}</div>
               <div className="text-lg font-black text-emerald-500 tabular-nums">{scoreCall}</div>
            </div>
            <div className={`text-center transition-all ${servingTeam === 2 ? 'scale-110' : 'opacity-20'}`}>
              <p className="text-[8px] font-black text-emerald-400 uppercase mb-2 truncate w-20">{team2?.name}</p>
              <p className="text-5xl font-black tracking-tighter tabular-nums">{s2}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button onClick={handleProPoint} disabled={hasWinner} className="py-5 bg-emerald-500 text-white rounded-2xl shadow-lg hover:bg-emerald-400 disabled:opacity-20 transition-all active:scale-95 flex flex-col items-center gap-1"><i className="fa-solid fa-plus text-base"></i><span className="font-black text-[8px] uppercase tracking-widest">Point</span></button>
          <button onClick={handleProFault} disabled={hasWinner} className="py-5 bg-slate-800 dark:bg-slate-700 text-white rounded-2xl shadow-lg hover:bg-slate-700 disabled:opacity-20 transition-all active:scale-95 flex flex-col items-center gap-1"><i className="fa-solid fa-rotate text-base"></i><span className="font-black text-[8px] uppercase tracking-widest">Fault</span></button>
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleUndo} disabled={history.length === 0} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-all text-[8px] font-black uppercase tracking-widest disabled:opacity-30 border border-slate-200 dark:border-slate-700">Undo</button>
          <button onClick={handleFinalize} className={`flex-[2] py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${hasWinner ? 'bg-amber-500 text-white shadow-lg' : 'bg-blue-950 dark:bg-emerald-600 text-white'}`}>{hasWinner ? 'Submit' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default SideOutScorer;
