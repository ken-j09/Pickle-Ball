
import React from 'react';

const RulesViewer: React.FC = () => {
  const chapters = [
    {
      id: "setup",
      number: "01",
      title: "The Setup",
      subtitle: "Technical Blueprint & Equipment",
      icon: "fa-trowel-bricks",
      colorClass: "border-blue-500",
      bgClass: "bg-blue-500",
      textClass: "text-blue-600 dark:text-blue-400",
      items: [
        { label: "Net Dimensions", text: "Official height is 36 inches at the sidelines and 34 inches at the center of the court." },
        { label: "The Ball", text: "Must weigh 0.78–0.935 oz. Outdoor balls typically have 40 small holes for wind resistance, while indoor balls have 26 larger holes for better bounce on smooth surfaces." },
        { label: "The Paddle", text: "Combined length and width cannot exceed 24 inches. Most 'Pro Pads' weigh between 7.5–8.5 oz." },
        { label: "The Court", text: "20' x 44' for both singles and doubles. Identical footprint to a doubles badminton court." }
      ]
    },
    {
      id: "action",
      number: "02",
      title: "The Action",
      subtitle: "The Flow of the Game",
      icon: "fa-bolt",
      colorClass: "border-emerald-500",
      bgClass: "bg-emerald-500",
      textClass: "text-emerald-600 dark:text-emerald-400",
      items: [
        { label: "Double Bounce Rule", text: "After the serve, the ball must bounce once on each side before any volleys are allowed." },
        { label: "Service Protocol", text: "Serves must be underhand, below the waist, and directed diagonally to the opponent's court." },
        { label: "Stacking Rule", text: "Partners may position themselves anywhere on their side as long as the correct server/receiver initiates the rally." },
        { label: "Scoring System", text: "Traditional games are played to 11 (win by 2). Tournaments often play to 15 or 21." }
      ]
    },
    {
      id: "kitchen",
      number: "03",
      title: "The Sacred Kitchen",
      subtitle: "The Non-Volley Zone (NVZ)",
      icon: "fa-kitchen-set",
      colorClass: "border-amber-500",
      bgClass: "bg-amber-500",
      textClass: "text-amber-600 dark:text-amber-400",
      items: [
        { label: "No Volleys", text: "You cannot hit a ball in the air while standing inside the Kitchen (the 7ft zone near the net)." },
        { label: "Momentum", text: "If your momentum carries you into the kitchen after a volley, even if the ball is dead, it is a fault." },
        { label: "Safe Entry", text: "You may only enter the kitchen if the ball has already bounced inside it." },
        { label: "Kitchen Lines", text: "The lines surrounding the Kitchen are part of the zone; standing on them counts as being in the Kitchen." }
      ]
    },
    {
      id: "faults",
      number: "04",
      title: "The Faults",
      subtitle: "What to Avoid",
      icon: "fa-hand-dots",
      colorClass: "border-red-500",
      bgClass: "bg-red-500",
      textClass: "text-red-600 dark:text-red-400",
      items: [
        { label: "Line Calls", text: "A ball hitting any line is considered 'in', except for the Kitchen line on a serve." },
        { label: "Net Touches", text: "Touching the net with your paddle, clothing, or body at any point during a rally is an immediate fault." },
        { label: "Double Hits", text: "Hitting the ball more than once before it crosses the net ends the rally." },
        { label: "Post Contact", text: "The ball hitting the net post is out. However, if it hits the net and goes over (except on serve), it's live." }
      ]
    },
    {
      id: "scoring",
      number: "05",
      title: "The Scoring",
      subtitle: "Rally vs Side-Out",
      icon: "fa-calculator",
      colorClass: "border-indigo-500",
      bgClass: "bg-indigo-500",
      textClass: "text-indigo-600 dark:text-indigo-400",
      items: [
        { label: "Side-Out Scoring", text: "The traditional way to play. You only score points when your team is serving. If you win a rally as the receiving team, you win the right to serve (a side-out), but no point is awarded." },
        { label: "Rally Scoring", text: "A faster-paced alternative. A point is awarded to the winner of every rally, regardless of who served. This keeps the game moving and is often used in professional leagues like the MLP." },
        { label: "The Third Number", text: "In doubles side-out scoring, the score is called as three numbers: Server Score, Receiver Score, and Server Number (1 or 2). For example, '4-2-1' means the serving team has 4, the receiving team has 2, and it's the first server." },
        { label: "Winning Condition", text: "Most games are played to 11 or 15, win by 2. In rally scoring, teams often 'freeze' at game point, meaning the final point must be won while serving." }
      ]
    }
  ];

  const [activeChapter, setActiveChapter] = React.useState<string | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    setActiveChapter(id);
    setIsDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      {/* Mobile/Tablet Chapter Selector - Dropdown */}
      <div className="2xl:hidden sticky top-0 z-40 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 -mx-5 px-5 py-3 mb-8">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between gap-3 px-5 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-sm font-bold text-slate-700 dark:text-slate-200"
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-book-open text-emerald-500"></i>
              <span>{activeChapter ? chapters.find(c => c.id === activeChapter)?.title : 'Select Chapter'}</span>
            </div>
            <i className={`fa-solid fa-chevron-down transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
          </button>

          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-30 bg-slate-950/20 backdrop-blur-sm 2xl:hidden" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute top-full left-0 right-0 mt-2 z-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => scrollToSection(chapter.id)}
                    className={`w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                      activeChapter === chapter.id ? 'bg-emerald-50/50 dark:bg-emerald-500/5' : ''
                    }`}
                  >
                    <span className={`text-xs font-black ${activeChapter === chapter.id ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}>
                      {chapter.number}
                    </span>
                    <span className={`text-sm font-bold ${activeChapter === chapter.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-400'}`}>
                      {chapter.title}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col 2xl:flex-row gap-8 lg:gap-12 animate-in fade-in duration-700 pb-20">
        <style>{`
        @keyframes pathAnimation {
          0% { stroke-dashoffset: 600; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes ballPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.8; }
        }
        @keyframes serverStackMove {
          0%, 25% { transform: translate(0, 0); }
          55%, 85% { transform: translate(140px, 0); }
          100% { transform: translate(0, 0); }
        }
        @keyframes receiverStackMove {
          0%, 25% { transform: translate(0, 0); }
          55%, 85% { transform: translate(-100px, -60px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes sweepPath {
          0% { stroke-dashoffset: 200; opacity: 0; }
          15% { opacity: 0.8; }
          45% { stroke-dashoffset: 0; }
          85% { opacity: 0.8; }
          100% { opacity: 0; }
        }
        @keyframes serveMotion {
          0% { transform: translate(0, 10px) rotate(-30deg); opacity: 0; }
          20% { opacity: 1; }
          50% { transform: translate(150px, -80px) rotate(30deg); }
          80% { opacity: 1; }
          100% { transform: translate(300px, -20px) rotate(60deg); opacity: 0; }
        }
        @keyframes swingMotion {
          0%, 100% { transform: rotate(-45deg); }
          50% { transform: rotate(45deg); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar-handbook::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar-handbook::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-handbook::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar-handbook::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }
        .animate-path {
          stroke-dasharray: 600;
          animation: pathAnimation 4s linear infinite;
        }
        .animate-ball {
          animation: ballPulse 2s ease-in-out infinite;
        }
        .animate-server-stack {
          animation: serverStackMove 6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .animate-receiver-stack {
          animation: receiverStackMove 6s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .animate-sweep {
          stroke-dasharray: 200;
          animation: sweepPath 6s ease-in-out infinite;
        }
        .animate-serve-ball {
          animation: serveMotion 3s infinite linear;
        }
        .animate-paddle-swing {
          animation: swingMotion 3s infinite ease-in-out;
          transform-origin: center bottom;
        }
      `}</style>

      {/* Quick Nav Sidebar */}
      <nav className="hidden 2xl:block w-64 shrink-0">
        <div className="sticky top-10 space-y-4">
          <div className="px-6 mb-8">
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">Chapters</h4>
            <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
          </div>
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => scrollToSection(chapter.id)}
              className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-left transition-all hover:bg-white dark:hover:bg-slate-900 group"
            >
              <span className="text-xs font-black text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors">
                {chapter.number}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-blue-950 dark:group-hover:text-white transition-colors">
                {chapter.title}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 space-y-12 md:space-y-16">
        <header className="relative bg-blue-950 dark:bg-slate-900 p-8 md:p-16 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-6 md:mb-8 border border-emerald-500/30 backdrop-blur-md">
              <i className="fa-solid fa-graduation-cap"></i> New Player Academy
            </div>
            <h1 className="text-3xl md:text-6xl font-black mb-6 tracking-tighter leading-none uppercase">
              Pickleball <span className="text-emerald-500">Mastery.</span>
            </h1>
            <p className="text-blue-100/70 text-base md:text-xl font-medium leading-relaxed">
              From the first serve to the winning dink—everything you need to know about the world's fastest growing sport.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </header>

        <div className="space-y-16 md:space-y-24 relative">
          <div className="absolute left-[2.45rem] top-10 bottom-10 w-px bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

          {chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id} className="relative group px-2 md:px-0">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-16 items-start">
                <div className="relative flex-shrink-0 z-10">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-[1.8rem] sm:rounded-[2.2rem] lg:rounded-[2.8rem] ${chapter.bgClass} flex flex-col items-center justify-center shadow-2xl transition-all group-hover:scale-105 group-hover:rotate-3 ring-4 ring-white dark:ring-slate-950 overflow-hidden flex-shrink-0`}>
                    <span className="text-white text-[7px] sm:text-[9px] lg:text-[11px] font-black uppercase opacity-60 leading-none mb-1 lg:mb-1.5 tracking-tighter whitespace-nowrap">Chapter</span>
                    <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-black leading-none">{chapter.number}</span>
                  </div>
                </div>

                <div className="flex-1 space-y-8 md:space-y-10 w-full">
                  <div>
                    <h3 className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 ${chapter.textClass}`}>
                      {chapter.subtitle}
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-black text-blue-950 dark:text-white uppercase tracking-tighter flex items-center gap-4">
                      {chapter.title}
                      <i className={`fa-solid ${chapter.icon} text-lg opacity-20`}></i>
                    </h2>
                  </div>

                  {/* Setup Chapter Visual Aid */}
                  {chapter.id === 'setup' && (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-xl overflow-hidden ring-1 ring-slate-100 dark:ring-transparent">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                          <i className="fa-solid fa-ruler-vertical text-lg"></i>
                        </div>
                        <p className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Net Height Specification</p>
                      </div>
                      <div className="w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-3xl relative flex items-end justify-center px-12 pb-8 border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        <svg viewBox="0 0 400 120" className="w-full h-full drop-shadow-md">
                          {/* Ground */}
                          <line x1="0" y1="110" x2="400" y2="110" stroke="#cbd5e1" strokeWidth="2" />
                          {/* Net Posts */}
                          <rect x="50" y="20" width="4" height="90" fill="#475569" />
                          <rect x="346" y="20" width="4" height="90" fill="#475569" />
                          {/* Net Top Cord with Curve */}
                          <path d="M 52 20 Q 200 25 348 20" fill="none" stroke="#1e293b" strokeWidth="4" />
                          {/* Measurements */}
                          <g className="text-slate-400 font-black">
                            <text x="20" y="25" fontSize="10" className="fill-blue-500">36"</text>
                            <text x="185" y="45" fontSize="10" className="fill-blue-600">34"</text>
                            <text x="360" y="25" fontSize="10" className="fill-blue-500">36"</text>
                            {/* Arrows */}
                            <path d="M 52 20 L 52 110" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M 200 25 L 200 110" stroke="#2563eb" strokeWidth="1" strokeDasharray="2 2" />
                            <path d="M 348 20 L 348 110" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2 2" />
                          </g>
                          <text x="200" y="118" textAnchor="middle" fontSize="8" className="fill-slate-400 uppercase tracking-[0.2em] font-black">Sideline to Sideline</text>
                        </svg>
                        <div className="absolute top-4 right-6 text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/5 px-2 py-1 rounded">Technical View</div>
                      </div>
                    </div>
                  )}

                  {/* Standard Item Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8 w-full">
                    {chapter.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-6 md:p-10 bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-500/20 border-l-8 ${chapter.colorClass} ring-1 ring-slate-100 dark:ring-transparent`}
                      >
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                          <div className={`w-2 h-2 rounded-full ${chapter.bgClass} shadow-sm`}></div>
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                        <p className="text-[14px] md:text-[16px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Service Protocol Visual Enhancement */}
                  {chapter.id === 'action' && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-10 shadow-xl overflow-hidden ring-1 ring-slate-100 dark:ring-transparent">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                            <i className="fa-solid fa-shuttlecock text-lg"></i>
                          </div>
                          <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Service Protocol Mechanics</p>
                        </div>
                        <p className="text-[14px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                          Official serves must be <span className="text-emerald-500">underhand</span>. The paddle contact with the ball must be <span className="italic">below the waist</span> (navel level) with a distinct upward arc.
                        </p>
                        <div className="flex gap-2">
                           <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded uppercase">Below Waist</span>
                           <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-black px-2 py-1 rounded uppercase">Diagonal Target</span>
                        </div>
                      </div>
                      <div className="w-full lg:w-80 h-52 bg-slate-100 dark:bg-slate-800/50 rounded-3xl relative flex items-center justify-center p-6 border border-slate-200 dark:border-slate-700/50">
                        <svg viewBox="0 0 200 150" className="w-full h-full">
                          {/* Person Silhouette (Abstract) */}
                          <circle cx="50" cy="40" r="10" fill="#94a3b8" />
                          <line x1="50" y1="50" x2="50" y2="100" stroke="#94a3b8" strokeWidth="4" />
                          {/* Waist Line */}
                          <line x1="30" y1="80" x2="70" y2="80" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 2" />
                          <text x="75" y="83" fontSize="6" className="fill-red-400 font-black uppercase">Waist Line</text>
                          {/* Paddle */}
                          <g className="animate-paddle-swing">
                            <rect x="48" y="90" width="4" height="30" fill="#475569" />
                            <ellipse cx="50" cy="120" rx="8" ry="12" fill="#334155" />
                          </g>
                          {/* Ball Trajectory */}
                          <path d="M 50 115 Q 120 40 180 90" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" className="animate-sweep" />
                          <circle cx="50" cy="115" r="4" fill="#facc15" className="animate-serve-ball" />
                        </svg>
                        <div className="absolute top-4 left-6 text-[8px] font-black text-slate-400 uppercase tracking-widest">Side Profile</div>
                      </div>
                    </div>
                  )}

                  {/* Enhanced Stacking Section inside Action Chapter */}
                  {chapter.id === 'action' && (
                    <div className="space-y-8 mt-12">
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden ring-1 ring-slate-100 dark:ring-transparent">
                        <div className="relative z-10">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                                <i className="fa-solid fa-layer-group text-2xl"></i>
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Rule 4.B.6: Advanced Stacking</h4>
                                <div className="flex items-center gap-2">
                                  <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Positional Strategy</span>
                                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border border-slate-200 dark:border-slate-700">Official Tournament Use</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Phase 1: Serving */}
                            <div className="space-y-6 flex flex-col h-full">
                              <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
                                  <p className="text-[11px] font-black text-blue-950 dark:text-white uppercase tracking-[0.2em]">Service Phase Movement</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Animated Shift</span>
                              </div>
                              
                              <div className="flex-1 min-h-[300px] bg-slate-900/[0.03] dark:bg-slate-800/50 rounded-[2.5rem] relative border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center p-8 overflow-hidden shadow-inner group/diagram">
                                <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
                                  <rect x="50" y="50" width="300" height="200" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" className="text-slate-400 dark:text-slate-500" />
                                  <line x1="200" y1="50" x2="200" y2="250" stroke="#10b981" strokeWidth="6" />
                                  <line x1="50" y1="150" x2="135" y2="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" strokeOpacity="0.3" className="text-slate-400 dark:text-slate-500" />
                                  <rect x="135" y="50" width="65" height="200" fill="#10b981" fillOpacity="0.08" />
                                  
                                  <path d="M 100 180 L 260 180" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 6" strokeOpacity="0" className="animate-sweep" />

                                  <g className="animate-server-stack">
                                    <circle cx="100" cy="180" r="16" fill="#10b981" className="drop-shadow-lg" />
                                    <text x="100" y="184" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">S</text>
                                    <text x="100" y="210" textAnchor="middle" fontSize="8" fontWeight="900" fill="#10b981" fillOpacity="0.8" className="uppercase tracking-widest">Server</text>
                                  </g>

                                  <g transform="translate(160, 180)">
                                    <circle cx="0" cy="0" r="16" fill="#3b82f6" />
                                    <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">P</text>
                                    <text x="0" y="30" textAnchor="middle" fontSize="8" fontWeight="900" fill="#3b82f6" fillOpacity="0.8" className="uppercase tracking-widest">Partner</text>
                                  </g>
                                </svg>
                                <div className="absolute bottom-6 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center px-8 leading-relaxed">
                                  The Server (S) starts behind the designated box and crosses to the stacked side immediately after striking the ball.
                                </div>
                              </div>
                            </div>

                            {/* Phase 2: Receiving */}
                            <div className="space-y-6 flex flex-col h-full">
                              <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">2</div>
                                  <p className="text-[11px] font-black text-blue-950 dark:text-white uppercase tracking-[0.2em]">Receiving Phase Movement</p>
                                </div>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Animated Shift</span>
                              </div>

                              <div className="flex-1 min-h-[300px] bg-slate-900/[0.03] dark:bg-slate-800/50 rounded-[2.5rem] relative border border-slate-200 dark:border-slate-700/50 flex flex-col items-center justify-center p-8 overflow-hidden shadow-inner group/diagram">
                                <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-2xl">
                                  <rect x="50" y="50" width="300" height="200" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" className="text-slate-400 dark:text-slate-500" />
                                  <line x1="200" y1="50" x2="200" y2="250" stroke="#3b82f6" strokeWidth="6" />
                                  <rect x="135" y="50" width="65" height="200" fill="#3b82f6" fillOpacity="0.08" />
                                  
                                  <path d="M 120 180 L 70 90" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="10 6" strokeOpacity="0" className="animate-sweep" />

                                  <g className="animate-receiver-stack">
                                    <circle cx="120" cy="180" r="16" fill="#10b981" />
                                    <text x="120" y="184" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">R</text>
                                    <text x="120" y="210" textAnchor="middle" fontSize="8" fontWeight="900" fill="#10b981" fillOpacity="0.8" className="uppercase tracking-widest">Receiver</text>
                                  </g>

                                  <g transform="translate(120, 240)">
                                    <circle cx="0" cy="0" r="16" fill="#3b82f6" />
                                    <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">P</text>
                                    <text x="0" y="28" textAnchor="middle" fontSize="8" fontWeight="900" fill="#3b82f6" fillOpacity="0.8" className="uppercase tracking-widest">Partner</text>
                                  </g>
                                </svg>
                                <div className="absolute bottom-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center px-8 leading-relaxed">
                                  Receiver (R) handles the return from the correct box, then sprints to the stacked side of the Kitchen line.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ATP Mastery */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] flex flex-col lg:flex-row items-center gap-10 shadow-xl overflow-hidden ring-1 ring-slate-100 dark:ring-transparent">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                                  <i className="fa-solid fa-arrows-to-circle text-xl"></i>
                              </div>
                              <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">ATP Mastery (Around-the-Post)</p>
                            </div>
                            <p className="text-[14px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                              An ATP is a legal shot where the striker returns a wide-angled bounce <span className="text-emerald-500 italic">around</span> the net post.
                            </p>
                        </div>
                        
                        <div className="w-full lg:w-80 h-52 bg-slate-900/[0.03] dark:bg-slate-800/50 rounded-3xl relative border border-slate-200 dark:border-slate-700/50 flex items-center justify-center p-6 shadow-inner">
                            <svg viewBox="0 0 300 200" className="w-full h-full opacity-90 drop-shadow-lg">
                              <rect x="50" y="20" width="200" height="160" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" className="text-slate-400 dark:text-slate-500" />
                              <line x1="30" y1="100" x2="270" y2="100" stroke="currentColor" strokeWidth="4" className="text-slate-300 dark:text-slate-600" />
                              <path 
                                d="M 230 160 Q 285 145 285 100 Q 285 55 230 40" 
                                fill="none" 
                                stroke="#10b981" 
                                strokeWidth="3" 
                                strokeDasharray="10 6" 
                                className="animate-path"
                              />
                              <circle cx="230" cy="160" r="8" fill="#10b981" className="animate-ball drop-shadow-md" />
                              <text x="280" y="105" fontSize="10" fontWeight="900" className="fill-emerald-500 font-sans uppercase">Around Post</text>
                            </svg>
                        </div>
                      </div>
                    </div>
                  )}

                  {chapter.id === 'kitchen' && (
                    <div className="bg-amber-500/[0.04] border border-amber-500/20 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-sm">
                       <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                          <i className="fa-solid fa-lightbulb text-xl"></i>
                       </div>
                       <div>
                          <p className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">Rule Highlight: Foot Faults</p>
                          <p className="text-[14px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                            It is a fault if any part of your foot touches the kitchen line or the kitchen zone while volleying a ball.
                          </p>
                       </div>
                    </div>
                  )}

                  {chapter.id === 'scoring' && (
                    <div className="bg-indigo-500/5 border border-indigo-500/20 p-8 rounded-[2.5rem] shadow-xl overflow-hidden ring-1 ring-slate-100 dark:ring-transparent">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                          <i className="fa-solid fa-scale-balanced text-lg"></i>
                        </div>
                        <p className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Scoring System Comparison</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-server text-indigo-500"></i> Side-Out
                          </h4>
                          <ul className="space-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <li className="flex items-start gap-2">
                              <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                              <span>Points only on serve</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                              <span>3-number score call (4-2-1)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                              <span>Traditional tournament standard</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-200 dark:border-slate-700">
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                            <i className="fa-solid fa-bolt text-amber-500"></i> Rally
                          </h4>
                          <ul className="space-y-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                            <li className="flex items-start gap-2">
                              <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                              <span>Point on every rally</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                              <span>2-number score call (4-2)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <i className="fa-solid fa-check text-emerald-500 mt-0.5"></i>
                              <span>Faster games, TV friendly</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <footer className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] md:rounded-[4rem] text-center border border-slate-200 dark:border-slate-800 shadow-2xl ring-1 ring-slate-100 dark:ring-transparent">
           <div className="max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/30 transition-transform hover:scale-110">
                 <i className="fa-solid fa-check-double text-2xl"></i>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-blue-950 dark:text-white uppercase tracking-tight mb-6 leading-tight">Master the Game,<br/>Control the Court.</h3>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-base md:text-lg mb-12 leading-relaxed">
                 Ready to put this knowledge to the test in a real tournament setting?
              </p>
           </div>
        </footer>
      </div>
    </div>
  </div>
);
};

export default RulesViewer;
