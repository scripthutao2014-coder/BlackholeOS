import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Smile, Sun, CheckCircle2, ChevronRight, 
  RefreshCcw, Heart, Brain, Zap, Send, Moon, MessageSquare 
} from 'lucide-react';

interface OptimismeAppProps {
  accentColor?: 'blue' | 'green' | 'white';
}

const COSMIC_QUOTES = [
  "Even the strongest gravitational field cannot devour your potential. Information in a black hole is never truly lost.",
  "Your light is traveling across infinite systems. Today, let it illuminate this sub-system.",
  "A singularity is not an end, but a clean canvas of absolute possibility. Embrace your clean slate.",
  "In a universe of cold dark matter, your conscious warmth is the most precious resource.",
  "Every system reboot is a chance to rewrite the active code of your destiny.",
  "Your core files are healthy. Your drivers are loaded. You are fully equipped for this orbital rotation.",
  "Do not let memory leaks of yesterday's failures drain your available battery for today.",
  "The Event Horizon is just a boundary of perspective. Step beyond it with courage.",
  "Entropy is natural, but so is the beautiful complexity you construct each day."
];

const DAILY_QUESTS = [
  { id: 'hydrate', label: "Hydrate sub-systems: Drink a refreshing glass of water." },
  { id: 'breathe', label: "Perform 1 complete cycle of the Optimisme Breathing Engine." },
  { id: 'gaze', label: "Gaze at the background particles: Reflect on 1 thing you appreciate right now." },
  { id: 'mascot', label: "Transmit positive crumbs to B.A.D. the Cyber-Duck." },
  { id: 'code', label: "Clean up 1 mental backlog: Forgive a past operational error." }
];

export default function OptimismeApp({ accentColor = 'blue' }: OptimismeAppProps) {
  const [activeTab, setActiveTab] = useState<'quotes' | 'breathing' | 'tracker' | 'duck'>('quotes');
  const [currentQuote, setCurrentQuote] = useState(COSMIC_QUOTES[0]);
  const [quoteAnim, setQuoteAnim] = useState(false);
  
  // Breathing state
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold (Full)' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [breathingCount, setBreathingCount] = useState(0);
  const [isBreathingActive, setIsBreathingActive] = useState(false);

  // Tracker State
  const [mood, setMood] = useState<string>('centered');
  const [moodHistory, setMoodHistory] = useState<{ date: string; level: number }[]>(() => {
    const saved = localStorage.getItem('blackhole_optimisme_history');
    return saved ? JSON.parse(saved) : [
      { date: 'Mon', level: 60 },
      { date: 'Tue', level: 75 },
      { date: 'Wed', level: 82 },
      { date: 'Thu', level: 70 },
      { date: 'Fri', level: 88 },
    ];
  });
  const [quests, setQuests] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('blackhole_optimisme_quests');
    return saved ? JSON.parse(saved) : {};
  });

  // Mascot interaction
  const [feedInput, setFeedInput] = useState('');
  const [duckResponse, setDuckResponse] = useState('QUACK! Introduce positive code and I shall digest it into high-frequency hope.');
  const [duckState, setDuckState] = useState<'idle' | 'eating' | 'happy'>('idle');

  // Load new random quote
  const handleNextQuote = () => {
    setQuoteAnim(true);
    setTimeout(() => {
      let nextQuote = currentQuote;
      while (nextQuote === currentQuote) {
        nextQuote = COSMIC_QUOTES[Math.floor(Math.random() * COSMIC_QUOTES.length)];
      }
      setCurrentQuote(nextQuote);
      setQuoteAnim(false);
    }, 300);
  };

  // Breathing Engine Logic
  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          // transition to next phase
          setBreathingPhase((currentPhase) => {
            switch (currentPhase) {
              case 'Inhale':
                return 'Hold (Full)';
              case 'Hold (Full)':
                return 'Exhale';
              case 'Exhale':
                return 'Hold (Empty)';
              case 'Hold (Empty)':
                setBreathingCount(c => c + 1);
                // Automatically check off quest if active
                toggleQuest('breathe', true);
                return 'Inhale';
              default:
                return 'Inhale';
            }
          });
          return 4; // Reset to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase]);

  // Sync state helpers
  const toggleQuest = (id: string, forceValue?: boolean) => {
    const next = { ...quests, [id]: forceValue !== undefined ? forceValue : !quests[id] };
    setQuests(next);
    localStorage.setItem('blackhole_optimisme_quests', JSON.stringify(next));
  };

  const handleMoodCheckIn = (selectedMood: string, score: number) => {
    setMood(selectedMood);
    const dayName = new Date().toLocaleDateString([], { weekday: 'short' });
    const updatedHistory = [...moodHistory];
    
    // Check if we already have today in history, if so update it, else add it
    const existingIndex = updatedHistory.findIndex(h => h.date === dayName);
    if (existingIndex !== -1) {
      updatedHistory[existingIndex] = { date: dayName, level: score };
    } else {
      if (updatedHistory.length >= 7) updatedHistory.shift();
      updatedHistory.push({ date: dayName, level: score });
    }
    
    setMoodHistory(updatedHistory);
    localStorage.setItem('blackhole_optimisme_history', JSON.stringify(updatedHistory));
  };

  // Duck feeding helper
  const handleFeedDuck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedInput.trim()) return;

    setDuckState('eating');
    setDuckResponse("Chomp... crunch... digesting negative matter... converting to light...");
    
    setTimeout(() => {
      setDuckState('happy');
      const responses = [
        "QUACK! That affirmation felt like a fresh cache flush! My quantum sub-processors are vibrating with joy!",
        "HONK! Positivity logged. Memory buffer optimized. You have increased my cosmic density by 14%!",
        "QUACK QUACK! High-fidelity hope received. I have updated my root dictionary. You are doing fantastic!",
        "WADDLE-QUACK! That thought was incredibly nutritious. Remember, your code is clean and your mind is vast!"
      ];
      setDuckResponse(responses[Math.floor(Math.random() * responses.length)]);
      setFeedInput('');
      toggleQuest('mascot', true);
      
      setTimeout(() => setDuckState('idle'), 3000);
    }, 1500);
  };

  // Color mappings based on accent color
  const getAccentText = () => {
    if (accentColor === 'green') return 'text-emerald-400';
    if (accentColor === 'white') return 'text-slate-100';
    return 'text-blue-400';
  };

  const getAccentBorder = () => {
    if (accentColor === 'green') return 'border-emerald-500/30';
    if (accentColor === 'white') return 'border-slate-500/30';
    return 'border-blue-500/30';
  };

  const getAccentBg = () => {
    if (accentColor === 'green') return 'bg-emerald-600 hover:bg-emerald-500 text-black';
    if (accentColor === 'white') return 'bg-slate-200 hover:bg-white text-black';
    return 'bg-blue-600 hover:bg-blue-500 text-white';
  };

  const getAccentRing = () => {
    if (accentColor === 'green') return 'ring-emerald-500/20';
    if (accentColor === 'white') return 'ring-slate-500/20';
    return 'ring-blue-500/20';
  };

  // Progress percentage of quests
  const completedCount = Object.values(quests).filter(Boolean).length;
  const questProgress = Math.round((completedCount / DAILY_QUESTS.length) * 100);

  return (
    <div className="h-full w-full bg-slate-950/70 overflow-hidden flex flex-col font-sans select-none text-slate-300">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/80 border-b border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white font-display tracking-wider">OPTIMISME SUITE</h1>
            <p className="text-[10px] text-slate-500 font-mono">Sub-system positivity maintenance v1.4</p>
          </div>
        </div>

        {/* Quest completion quick bar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-slate-500 font-mono">TODAY'S HARMONY</span>
            <div className="text-xs font-bold text-slate-200 font-mono">{questProgress}%</div>
          </div>
          <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${
                accentColor === 'green' ? 'bg-emerald-500' : accentColor === 'white' ? 'bg-slate-300' : 'bg-blue-500'
              }`}
              style={{ width: `${questProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex bg-slate-950 border-b border-slate-900/60 p-1 shrink-0">
        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'quotes' 
              ? 'bg-slate-900 text-white shadow-sm border border-slate-800/40' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cosmic Hope</span>
        </button>
        <button
          onClick={() => setActiveTab('breathing')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'breathing' 
              ? 'bg-slate-900 text-white shadow-sm border border-slate-800/40' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Breathing Engine</span>
        </button>
        <button
          onClick={() => setActiveTab('tracker')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'tracker' 
              ? 'bg-slate-900 text-white shadow-sm border border-slate-800/40' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Daily Tracker</span>
        </button>
        <button
          onClick={() => setActiveTab('duck')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'duck' 
              ? 'bg-slate-900 text-white shadow-sm border border-slate-800/40' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Feed B.A.D.</span>
        </button>
      </div>

      {/* Main body viewport */}
      <div className="flex-1 overflow-y-auto p-5 min-h-0">
        
        {/* TAB 1: COSMIC HOPE & AFFIRMATIONS */}
        {activeTab === 'quotes' && (
          <div className="h-full flex flex-col justify-between max-w-xl mx-auto py-4">
            <div className="text-center space-y-2 mb-4">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-widest ${getAccentText()}`}>
                Affirmation Engine
              </span>
              <h2 className="text-xl font-bold font-display text-white">Quantum Positivity Infusion</h2>
              <p className="text-xs text-slate-500">Generate stable optimistic code blocks calibrated for organic brains.</p>
            </div>

            {/* Quote container */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div 
                className={`relative w-full p-8 rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-850/70 text-center shadow-xl transition-all duration-300 ${
                  quoteAnim ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                {/* Visual decorative star/glowing dots */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-full flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  STABLE EMISSION
                </div>

                <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed italic select-text">
                  "{currentQuote}"
                </p>

                <div className="mt-6 flex justify-center gap-2">
                  <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2 py-0.5 rounded border border-slate-900">
                    SENDER: SYSTEM_HARMONY
                  </span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 text-center">
              <button
                onClick={handleNextQuote}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 mx-auto cursor-pointer shadow-lg active:scale-95 ${getAccentBg()}`}
              >
                <RefreshCcw className="w-4 h-4 animate-hover-spin" />
                Refract New Perspective
              </button>
              <p className="text-[10px] text-slate-600 mt-2">Every code fragment is verified non-depressive.</p>
            </div>
          </div>
        )}

        {/* TAB 2: MINDFULNESS & BREATHING ENGINE */}
        {activeTab === 'breathing' && (
          <div className="h-full flex flex-col items-center justify-between max-w-md mx-auto py-2">
            <div className="text-center space-y-1 mb-2">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-widest ${getAccentText()}`}>
                Pneumatic Regulator
              </span>
              <h2 className="text-xl font-bold font-display text-white">Prana Core Sync</h2>
              <p className="text-xs text-slate-500">Calm heart telemetry with symmetrical Box Breathing cycles.</p>
            </div>

            {/* Animated circle container */}
            <div className="flex-1 flex flex-col items-center justify-center my-4">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Background breathing sphere halo */}
                <div 
                  className={`absolute rounded-full border border-dashed transition-all duration-1000 ${
                    isBreathingActive 
                      ? 'border-blue-500/30 scale-110 animate-spin' 
                      : 'border-slate-800 scale-100'
                  }`}
                  style={{ width: '100%', height: '100%' }}
                />

                {/* Main animated bubble */}
                <div 
                  className={`rounded-full flex flex-col items-center justify-center transition-all shadow-2xl ${
                    !isBreathingActive 
                      ? 'w-40 h-40 bg-slate-900 border border-slate-800' 
                      : breathingPhase === 'Inhale' 
                        ? 'w-56 h-56 bg-gradient-to-tr from-blue-600/30 to-indigo-500/20 border-2 border-blue-500 shadow-blue-500/20' 
                        : breathingPhase === 'Hold (Full)' 
                          ? 'w-56 h-56 bg-gradient-to-tr from-amber-600/30 to-amber-500/20 border-2 border-amber-400 shadow-amber-400/20' 
                          : breathingPhase === 'Exhale' 
                            ? 'w-36 h-36 bg-gradient-to-tr from-indigo-900/50 to-purple-900/30 border-2 border-purple-500 shadow-purple-500/10' 
                            : 'w-36 h-36 bg-slate-950 border border-slate-900' // Hold (Empty)
                  }`}
                  style={{ transitionDuration: '4000ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
                >
                  <span className={`text-xs font-mono tracking-widest uppercase mb-1 font-bold ${
                    breathingPhase.includes('Hold') ? 'text-amber-400 animate-pulse' : 'text-white'
                  }`}>
                    {isBreathingActive ? breathingPhase : 'READY'}
                  </span>
                  
                  {isBreathingActive ? (
                    <div className="flex flex-col items-center">
                      <span className="text-4xl font-black font-mono tracking-tighter text-white">
                        {breathingTimer}s
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono mt-1">
                        CYCLE COUNT: {breathingCount}
                      </span>
                    </div>
                  ) : (
                    <span className="text-2xl font-black font-mono text-slate-500">---</span>
                  )}
                </div>
              </div>
            </div>

            {/* Breathing controls */}
            <div className="w-full space-y-3">
              <button
                onClick={() => {
                  setIsBreathingActive(!isBreathingActive);
                  if(!isBreathingActive) {
                    setBreathingPhase('Inhale');
                    setBreathingTimer(4);
                  }
                }}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 cursor-pointer ${
                  isBreathingActive 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20' 
                    : getAccentBg()
                }`}
              >
                {isBreathingActive ? 'Suspend Breathing Cycle' : 'Engage Breathing Regulator'}
              </button>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                <span>Box Cadence: 4s-4s-4s-4s</span>
                <span className="text-emerald-400">PULMONARY COMPLIANT</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DAILY TRACKER & QUESTS */}
        {activeTab === 'tracker' && (
          <div className="space-y-5 max-w-xl mx-auto py-2">
            
            {/* Mood selector */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/40">
              <h3 className="text-xs font-bold text-white mb-3 tracking-wide">SUB-SYSTEM MOOD CHECK-IN</h3>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { name: 'inspired', label: '🔥 Inspired', val: 95 },
                  { name: 'peaceful', label: '🌸 Peaceful', val: 85 },
                  { name: 'centered', label: '⚖️ Centered', val: 70 },
                  { name: 'restless', label: '🌪️ Restless', val: 45 },
                  { name: 'depleted', label: '🔋 Depleted', val: 25 },
                ].map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleMoodCheckIn(item.name, item.val)}
                    className={`p-2.5 rounded-lg border text-[10px] font-semibold text-center transition-all cursor-pointer ${
                      mood === item.name 
                        ? 'bg-blue-600/10 border-blue-500 text-white shadow-inner' 
                        : 'bg-slate-950 border-slate-900 text-slate-500 hover:border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    <div>{item.label.split(' ')[0]}</div>
                    <div className="mt-1 font-mono text-[9px] font-normal">{item.label.split(' ')[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Simple Sparkline SVG Graph */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/40">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-white tracking-wide">HISTORICAL OPTIMISME WAVE</h3>
                <span className="text-[9px] font-mono text-slate-500">LAST 5 TELEMETRY READINGS</span>
              </div>

              {/* Responsive SVG Sparkline */}
              <div className="h-20 w-full bg-slate-950 rounded-lg border border-slate-900 flex items-center justify-center p-2">
                <svg className="w-full h-full" viewBox="0 0 400 60" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="15" x2="400" y2="15" stroke="#1e293b" strokeDasharray="3" />
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#1e293b" strokeDasharray="3" />
                  <line x1="0" y1="45" x2="400" y2="45" stroke="#1e293b" strokeDasharray="3" />

                  {/* Gradient fill */}
                  <defs>
                    <linearGradient id="optimGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Plot wave */}
                  {(() => {
                    const points = moodHistory.map((h, i) => {
                      const x = (i / (moodHistory.length - 1)) * 380 + 10;
                      // invert y because svg 0 is top. mapping 0-100 to y=55-5
                      const y = 55 - (h.level / 100) * 45;
                      return { x, y, label: h.date, level: h.level };
                    });

                    const pathD = points.reduce((acc, p, i) => {
                      return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
                    }, '');

                    const areaD = pathD + `L ${points[points.length - 1].x} 55 L ${points[0].x} 55 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#optimGrad)" />
                        <path d={pathD} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        
                        {/* Interactive Nodes */}
                        {points.map((p, idx) => (
                          <g key={idx}>
                            <circle cx={p.x} cy={p.y} r="4.5" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="2" />
                            <text x={p.x} y={p.y - 8} textAnchor="middle" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                              {p.level}%
                            </text>
                            <text x={p.x} y="54" textAnchor="middle" fill="#475569" fontSize="8" fontFamily="monospace">
                              {p.label}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Quests check lists */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/40">
              <h3 className="text-xs font-bold text-white mb-3 tracking-wide">TODAY'S CONSTRUCTIVE QUESTS</h3>
              <div className="space-y-2">
                {DAILY_QUESTS.map((quest) => (
                  <div
                    key={quest.id}
                    onClick={() => toggleQuest(quest.id)}
                    className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                      quests[quest.id]
                        ? 'bg-slate-950/40 border-slate-800 text-slate-500'
                        : 'bg-slate-950 border-slate-900 text-slate-300 hover:border-slate-850'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <CheckCircle2 className={`w-4 h-4 ${quests[quest.id] ? 'text-emerald-500' : 'text-slate-700'}`} />
                    </div>
                    <span className={`text-[11px] leading-tight select-none ${quests[quest.id] ? 'line-through' : ''}`}>
                      {quest.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: THE CYBER-DUCK MASCOT B.A.D. INTERACTION */}
        {activeTab === 'duck' && (
          <div className="h-full flex flex-col justify-between max-w-md mx-auto py-2">
            <div className="text-center space-y-1">
              <span className={`text-[10px] font-bold font-mono uppercase tracking-widest ${getAccentText()}`}>
                Mascot Reciprocity
              </span>
              <h2 className="text-xl font-bold font-display text-white">Encourage Mascot B.A.D.</h2>
              <p className="text-xs text-slate-500">Feed positive concepts to the Black Anomaly Duck in exchange for funny wisdom.</p>
            </div>

            {/* Duck Graphic & Bubble Area */}
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              
              {/* Dialogue Bubble */}
              <div className="relative max-w-xs bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl text-center mb-6 shadow-lg">
                <p className="text-xs text-slate-200 select-text leading-relaxed font-sans">
                  {duckResponse}
                </p>
                {/* Speech bubble arrow */}
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-slate-800 rotate-45" />
              </div>

              {/* Duck SVG */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className={`absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent opacity-50 ${
                  duckState === 'happy' ? 'animate-ping duration-1000' : ''
                }`} />

                <svg 
                  className={`w-28 h-28 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all duration-300 ${
                    duckState === 'eating' 
                      ? 'scale-90 rotate-6 translate-y-2' 
                      : duckState === 'happy'
                        ? 'scale-110 -translate-y-2'
                        : 'scale-100 hover:scale-105'
                  }`}
                  viewBox="0 0 100 100"
                >
                  {/* Duck body */}
                  <path d="M20 70 C20 45, 60 45, 65 70 C70 80, 45 85, 30 83 C20 81, 20 75, 20 70 Z" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
                  {/* Wing */}
                  <path d="M35 68 C35 60, 50 60, 52 68 C52 72, 42 75, 35 68 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                  {/* Head */}
                  <circle cx="55" cy="40" r="18" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
                  {/* Dark glasses (B.A.D style) */}
                  <path d="M52 35 L68 35 L66 42 L55 42 Z" fill="#020617" stroke="#3b82f6" strokeWidth="1.5" />
                  <line x1="50" y1="35" x2="52" y2="35" stroke="#3b82f6" strokeWidth="1.5" />
                  {/* Yellow/Orange Beak */}
                  <path d="M68 38 L82 42 L66 48 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" />
                  {/* Cyber wire/neck ornament */}
                  <path d="M48 50 Q55 52 52 58" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2" />
                </svg>

                {duckState === 'eating' && (
                  <div className="absolute right-0 top-1/2 w-3 h-3 bg-amber-400 rounded-full animate-ping" />
                )}
              </div>
            </div>

            {/* Feeding Form */}
            <form onSubmit={handleFeedDuck} className="w-full">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Feed B.A.D. a positive thought or code chunk..."
                  value={feedInput}
                  onChange={(e) => setFeedInput(e.target.value)}
                  disabled={duckState === 'eating'}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 placeholder-slate-650 outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20"
                />
                <button
                  type="submit"
                  disabled={!feedInput.trim() || duckState === 'eating'}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-center ${
                    feedInput.trim() && duckState !== 'eating'
                      ? getAccentBg()
                      : 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
