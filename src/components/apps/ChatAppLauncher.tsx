import { useState } from 'react';
import { ShieldAlert, RotateCw, ExternalLink, Wifi } from 'lucide-react';

export default function ChatAppLauncher() {
  const [loading, setLoading] = useState(true);
  const targetUrl = 'https://scripthutao2014-coder.github.io/IBT-App/';

  const handleRefresh = () => {
    setLoading(true);
  };

  return (
    <div className="h-full w-full bg-[#05070f] flex flex-col font-sans select-none overflow-hidden">
      {/* Top Banner indicating secure handshake */}
      <div className="bg-[#090d16] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-emerald-400/90 font-semibold tracking-wide">
            E2EE LINK: ACTIVE - ESTABLISHED SECURE SEC_NODE_7
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Reload Node
          </button>
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Open Native
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 w-full bg-[#030408] relative">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030408] z-20">
            <div className="w-10 h-10 border-2 border-t-emerald-500 border-r-transparent border-slate-800 rounded-full animate-spin mb-4" />
            <p className="text-xs text-emerald-400 font-mono tracking-widest glow-green uppercase">
              Connecting ExtinctionIBT Node...
            </p>
            <p className="text-[10px] text-slate-500 mt-1">Establishing socket handshake</p>
          </div>
        )}

        <iframe
          src={targetUrl}
          title="ExtinctionIBT ChatApp"
          onLoad={() => setLoading(false)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
          className="w-full h-full border-none bg-slate-950"
        />

        {/* Dynamic warning regarding network isolation */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3 max-w-xs shadow-xl backdrop-blur-sm pointer-events-auto z-10">
          <div className="flex gap-2.5 items-start">
            <ShieldAlert className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-slate-300">
              <span className="font-bold text-white block mb-0.5">Quantum Sandbox Confirmed</span>
              All chat packet operations are insulated inside BlackholeOS. Frame isolation keeps your ExtinctionIBT encryption variables hidden from parent telemetry loops.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
