import { AccentColor } from '../../types';
import { Sparkles, Terminal, Shield, AppWindow } from 'lucide-react';

interface WelcomeAppProps {
  accentColor: AccentColor;
  onOpenApp: (appId: any) => void;
}

export default function WelcomeApp({ accentColor, onOpenApp }: WelcomeAppProps) {
  const getAccentClass = () => {
    if (accentColor === 'green') return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10';
    if (accentColor === 'white') return 'text-slate-100 border-slate-500/20 bg-slate-500/5 hover:bg-slate-500/10';
    return 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10';
  };

  const getButtonClass = () => {
    if (accentColor === 'green') return 'bg-emerald-600 hover:bg-emerald-500 text-black font-semibold';
    if (accentColor === 'white') return 'bg-slate-200 hover:bg-white text-black font-semibold';
    return 'bg-blue-600 hover:bg-blue-500 text-white';
  };

  return (
    <div className="h-full w-full bg-slate-950/40 overflow-y-auto p-6 text-slate-300 select-text flex flex-col md:flex-row gap-6 font-sans">
      {/* Sidebar with Mascot & Stats */}
      <div className="flex-1 max-w-full md:max-w-[280px] flex flex-col items-center bg-slate-900/60 p-6 rounded-xl border border-slate-800/40 backdrop-blur-sm self-start">
        {/* Sleek Minimalist SVG Mascot: Black Anomaly Duck (B.A.D.) */}
        <div className="relative group w-36 h-36 flex items-center justify-center bg-black/60 rounded-full border border-slate-800 shadow-inner overflow-hidden mb-4">
          <div className="absolute inset-0 bg-radial from-blue-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          <svg
            className="w-28 h-28 drop-shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-transform duration-500 group-hover:scale-105"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background gravity warp orbits */}
            <ellipse cx="50" cy="55" rx="35" ry="12" stroke="rgba(59,130,246,0.2)" strokeWidth="1" strokeDasharray="3 3" />
            <ellipse cx="50" cy="55" rx="25" ry="8" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />

            {/* Duck Body - Sleek geometric shape (pitch black) */}
            <path
              d="M30 65C30 55 45 42 60 42C75 42 82 50 82 62C82 72 70 78 52 78C35 78 30 73 30 65Z"
              fill="#060813"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            {/* Wing details - Electric blue / Cyan gradient overlay */}
            <path
              d="M42 62C44 54 54 50 64 54C70 56 72 62 66 66C60 70 48 68 42 62Z"
              fill="#1e3a8a"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            
            {/* Duck Head & Neck */}
            <path
              d="M58 45C58 45 54 28 64 24C74 20 80 28 78 38C76 44 68 46 58 45Z"
              fill="#060813"
              stroke="#1e293b"
              strokeWidth="1.5"
            />

            {/* Glowing Space Eye */}
            <circle cx="70" cy="30" r="3.5" fill="#10b981" />
            <circle cx="70" cy="30" r="1.5" fill="#ffffff" />
            <path d="M66 28C68 26 72 26 74 28" stroke="#10b981" strokeWidth="0.75" strokeLinecap="round" />

            {/* Quantum Beak - Glowing blue / orange anomaly */}
            <path
              d="M78 32C84 31 88 34 86 38C82 40 76 37 78 32Z"
              fill="#3b82f6"
              stroke="#60a5fa"
              strokeWidth="1"
            />
            
            {/* Float Ripple effect beneath */}
            <path d="M35 78C45 81 55 81 65 78" stroke="rgba(59,130,246,0.4)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <h3 className="text-xl font-bold font-display text-white tracking-wide mb-1 text-center">
          B.A.D. Anomaly
        </h3>
        <span className="text-xs text-blue-400 font-mono mb-4 text-center">Mascot of Singularity</span>

        <div className="w-full h-px bg-slate-800/60 my-2" />

        <div className="w-full space-y-3 mt-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Mascot Mode:</span>
            <span className="text-emerald-400 font-mono">Swimming</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Gravitational Pull:</span>
            <span className="text-slate-300 font-mono">1.21 GW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Memory Pressure:</span>
            <span className="text-slate-300 font-mono">0.00%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Location:</span>
            <span className="text-indigo-400 font-mono">Event Horizon</span>
          </div>
        </div>

        <button
          onClick={() => onOpenApp('settings')}
          className={`w-full mt-6 py-2 px-4 rounded-lg text-sm transition-all duration-200 ${getButtonClass()}`}
        >
          Configure Settings
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-2 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">BlackholeOS</span>
            <span className="text-xs px-2 py-0.5 rounded-full border border-emerald-500/30 text-emerald-400 bg-emerald-500/5 font-mono">v1.0.0</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm leading-relaxed">
            A beautiful, high-efficiency client-side operating system designed to turn your web browser into a secure, space-themed dark productivity hub. BlackholeOS is highly optimized for low-resource environments and runs smoothly on devices with as little as 2GB RAM.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl border transition-all ${getAccentClass()}`}>
            <div className="flex items-center gap-3 mb-2 text-white font-medium">
              <Terminal className="w-5 h-5" />
              <h3>Virtual Sandbox Files</h3>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Manage your directories, view docs, and explore optimized operating metrics in our custom File Explorer. Fully persistent across window states.
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${getAccentClass()}`}>
            <div className="flex items-center gap-3 mb-2 text-white font-medium">
              <AppWindow className="w-5 h-5" />
              <h3>Integrated App Suite</h3>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Browse securely using the built-in Sandbox Browser, and experience full, integrated ChatApp access synced to ExtinctionIBT network endpoints.
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${getAccentClass()}`}>
            <div className="flex items-center gap-3 mb-2 text-white font-medium">
              <Shield className="w-5 h-5" />
              <h3>End-to-End Encryption</h3>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Insulated session authorization and secure local token generation are ready inside our designated Security Compliance dashboard.
            </p>
          </div>

          <div className={`p-4 rounded-xl border transition-all ${getAccentClass()}`}>
            <div className="flex items-center gap-3 mb-2 text-white font-medium">
              <Sparkles className="w-5 h-5" />
              <h3>Personalized Nebula</h3>
            </div>
            <p className="text-xs text-slate-400 leading-normal">
              Switch themes, swap interactive particle event horizon wallpapers, and alter accent colors dynamically inside the Settings application.
            </p>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-xl p-5">
          <h3 className="text-lg font-medium text-white mb-3">Quick Navigation Tips:</h3>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Double-click any <strong>Desktop Icon</strong> or use the bottom left <strong>Start Menu</strong> to launch apps.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Drag any window by its <strong>header bar</strong>. Resize from the bottom-right corner or double-click headers to toggle maximum size.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <span>Open the <strong>File Explorer</strong> and check out the <code>/home/pictures</code> directory to read more about B.A.D.!</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Open the <strong>Settings</strong> app to toggle between Cobalt Blue, Emerald Green, and Astral White accents.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
