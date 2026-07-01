import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, ShieldCheck, ExternalLink, Globe } from 'lucide-react';

interface BrowserAppProps {
  initialUrl?: string;
}

interface SimulatedPage {
  title: string;
  url: string;
  content: React.ReactNode;
}

export default function BrowserApp({ initialUrl = 'blackhole://search' }: BrowserAppProps) {
  const [urlInput, setUrlInput] = useState(initialUrl);
  const [currentUrl, setCurrentUrl] = useState(initialUrl);
  const [history, setHistory] = useState<string[]>([initialUrl]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string[]>([]);

  // Navigate to a new URL
  const navigateTo = (newUrl: string) => {
    let formattedUrl = newUrl.trim();
    if (!formattedUrl) return;

    if (!formattedUrl.startsWith('http://') && 
        !formattedUrl.startsWith('https://') && 
        !formattedUrl.startsWith('blackhole://')) {
      if (formattedUrl.includes('.') && !formattedUrl.includes(' ')) {
        formattedUrl = 'https://' + formattedUrl;
      } else {
        // Run actual Google Search
        formattedUrl = `https://www.google.com/search?q=${encodeURIComponent(formattedUrl)}&igu=1`;
      }
    }

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(formattedUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl(formattedUrl);
    setUrlInput(formattedUrl);
  };

  useEffect(() => {
    setUrlInput(currentUrl);
  }, [currentUrl]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateTo(urlInput);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentUrl(history[historyIndex - 1]);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentUrl(history[historyIndex + 1]);
    }
  };

  const handleRefresh = () => {
    // Just reset or log
    const prev = currentUrl;
    setCurrentUrl('');
    setTimeout(() => setCurrentUrl(prev), 50);
  };

  // Simulated Web Portal Pages
  const renderSimulatedPage = (url: string) => {
    const isSearchQuery = url.startsWith('blackhole://search');
    const query = isSearchQuery ? new URLSearchParams(url.split('?')[1] || '').get('q') || '' : '';

    if (isSearchQuery || url === 'blackhole://search') {
      return (
        <div className="p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-full font-sans select-text text-slate-300">
          <div className="flex flex-col items-center gap-1 mb-8 select-none animate-fade-in text-center">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-extrabold tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="text-[10px] font-mono font-black tracking-widest text-blue-400 bg-blue-950/40 border border-blue-900/40 rounded px-1.5 py-0.5 mt-2">
                ENGINE
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-1">POWERED BY SECURE GOOGLE INTEL LAYER</p>
          </div>

          <div className="w-full flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2.5 focus-within:border-blue-500/50 shadow-inner mb-6 transition-all">
            <Search className="w-5 h-5 text-slate-500 mr-2.5" />
            <input
              type="text"
              placeholder="Search Google or enter web address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter') {
                  navigateTo(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&igu=1`);
                }
              }}
              className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-500"
            />
            {searchQuery && (
              <button 
                onClick={() => navigateTo(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&igu=1`)}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full transition-colors font-medium"
              >
                Go
              </button>
            )}
          </div>

          {query ? (
            <div className="w-full text-left space-y-5">
              <h3 className="text-sm text-slate-500 font-mono">
                Search results for: <span className="text-blue-400 font-bold">"{query}"</span>
              </h3>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                <a href="#link" onClick={() => navigateTo('blackhole://astronomy')} className="text-blue-400 hover:underline text-lg font-medium font-display block mb-1">
                  Astronomy & Singularity Calculations: BlackholeOS Physics Core
                </a>
                <span className="text-xs text-emerald-500 font-mono block mb-2">blackhole://astronomy</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discover the mathematical principles governing BlackholeOS event horizons, and find optimization metrics compiled for low-end browser containers.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                <a href="#link" onClick={() => navigateTo('blackhole://news')} className="text-blue-400 hover:underline text-lg font-medium font-display block mb-1">
                  Singularity News: Real-Time Decentralized Cosmos Feed
                </a>
                <span className="text-xs text-emerald-500 font-mono block mb-2">blackhole://news</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Latest dispatches regarding ExtinctionIBT communications protocols, solar wind disruptions, and client-side operating system updates.
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                <a href="#link" onClick={() => navigateTo('https://scripthutao2014-coder.github.io/IBT-App/')} className="text-blue-400 hover:underline text-lg font-medium font-display block mb-1">
                  ExtinctionIBT Secure ChatApp - External Portal
                </a>
                <span className="text-xs text-emerald-500 font-mono block mb-2">https://scripthutao2014-coder.github.io/IBT-App/</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open the official integrated ChatApp interface directly inside your BlackholeOS secure window layer to message network nodes safely.
                </p>
              </div>

              <div className="p-4 bg-blue-950/20 rounded-xl border border-blue-800/30">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider block mb-1">Decentralized Intelligence:</span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  BlackholeOS has computed your request for "{query}" across 14 event horizon nodes. System resources remain highly optimized at 0.05% CPU usage.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center mt-4">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-widest block mb-4">PINS</span>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => navigateTo('blackhole://news')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-xs text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Singularity News
                </button>
                <button
                  onClick={() => navigateTo('blackhole://astronomy')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-xs text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Astronomy Portal
                </button>
                <button
                  onClick={() => navigateTo('https://scripthutao2014-coder.github.io/IBT-App/')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800/80 rounded-xl text-xs text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  Secure ChatApp
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (url === 'blackhole://news') {
      return (
        <div className="p-6 max-w-3xl mx-auto font-sans select-text text-slate-300 space-y-6">
          <div className="border-b border-slate-800 pb-4 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold font-display text-white">Singularity News Network</h2>
              <p className="text-xs text-slate-500 font-mono mt-1">Cosmic Node Feed | Secure Broadcast</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-2.5 py-1 rounded-full">
              LIVE BROADCAST
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase block mb-1">OS Update</span>
                <h3 className="text-lg font-bold text-white mb-2">BlackholeOS Core Fully Sandboxed on Low-End Hardware</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Engineers completed the 1.0.0 kernel compile. Using passive virtualization listeners and requestAnimationFrame pipelines, BlackholeOS runs safely under 120MB memory limits on ancient 2GB RAM platforms.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Posted 2 hours ago | Kernel team</span>
              </div>

              <div className="p-5 bg-slate-900/80 rounded-xl border border-slate-800">
                <span className="text-xs text-blue-400 font-bold tracking-widest uppercase block mb-1">Space Science</span>
                <h3 className="text-lg font-bold text-white mb-2">M87 Supermassive Hole Fluctuations Exceed Records</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Wavelength frequencies recorded by the Event Horizon Telescope indicate a massive energy surge. BlackholeOS astronomy cores have matched these frequencies with local clock cycles to calibrate quantum drift.
                </p>
                <span className="text-[10px] text-slate-500 font-mono">Posted 6 hours ago | Astrophysics Division</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">System Advisories</h4>
                <div className="space-y-3 text-xs">
                  <div className="border-l-2 border-emerald-500 pl-2.5">
                    <p className="text-white font-medium">Session Protection: Active</p>
                    <p className="text-[10px] text-slate-500">Auto-lock protocols verified.</p>
                  </div>
                  <div className="border-l-2 border-blue-500 pl-2.5">
                    <p className="text-white font-medium">ChatApp Status: Locked</p>
                    <p className="text-[10px] text-slate-500">Secure end-to-end sandbox channels.</p>
                  </div>
                  <div className="border-l-2 border-yellow-500 pl-2.5">
                    <p className="text-white font-medium">Solar Flares: Mild</p>
                    <p className="text-[10px] text-slate-500">0.02% latency drift on network packets.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-blue-950/20 to-slate-950/40 rounded-xl border border-blue-900/20 text-center">
                <p className="text-xs text-slate-300 font-medium mb-2">Browse the full ExtinctionIBT Portal</p>
                <button
                  onClick={() => navigateTo('https://scripthutao2014-coder.github.io/IBT-App/')}
                  className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 rounded-lg transition-colors"
                >
                  Launch App
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (url === 'blackhole://astronomy') {
      return (
        <div className="p-6 max-w-2xl mx-auto font-sans select-text text-slate-300 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold font-display text-white mb-1">Physics & Singularity Monitor</h2>
            <p className="text-xs text-slate-500 font-mono">Quantum calculations mapped in real-time</p>
          </div>

          <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-2">Horizon Mathematical Principle</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In general relativity, an event horizon is a boundary in spacetime beyond which events cannot affect an observer. In BlackholeOS, the event horizon represents our ultra-thin micro-kernel boundaries, insulating user variables from external network interceptors.
            </p>
            <div className="bg-black/40 p-4 rounded-lg font-mono text-center text-xs text-emerald-400 border border-slate-800/80">
              Rs = 2GM / c² &nbsp;&nbsp;|&nbsp;&nbsp; BlackholeOS Memory Radius = 15.4 MB
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
              <span className="text-xs text-slate-500 block">Cosmic Entropy Index</span>
              <span className="text-xl font-bold font-mono text-blue-400">S = k A c³ / 4 G ħ</span>
              <p className="text-[10px] text-slate-500 mt-1">Sustained thermodynamic equilibrium.</p>
            </div>
            <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800/50">
              <span className="text-xs text-slate-500 block">Calculated Gravity Well</span>
              <span className="text-xl font-bold font-mono text-emerald-400">G_Well: 99.998%</span>
              <p className="text-[10px] text-slate-500 mt-1">Zero leakages detected inside cache.</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const isSimulated = currentUrl.startsWith('blackhole://');

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col font-sans select-none overflow-hidden">
      {/* Browser Controls */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center gap-3">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex === history.length - 1}
            className="p-1.5 rounded-lg hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigateTo('blackhole://search')}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 focus-within:border-blue-500/40 focus-within:ring-1 focus-within:ring-blue-500/10 transition-all">
          {isSimulated ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 mr-2 shrink-0" />
          ) : (
            <Globe className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          )}
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent text-xs text-slate-200 outline-none w-full"
          />
        </div>

        {/* Outer Tab action */}
        {!isSimulated && (
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-slate-850 hover:bg-slate-800 text-blue-400 flex items-center gap-1 text-xs px-2.5 border border-slate-800 transition-colors"
          >
            Open Tab
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Frame / Simulated Page Viewport */}
      <div className="flex-1 w-full bg-slate-950 relative overflow-auto">
        {currentUrl === '' ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="w-8 h-8 border-2 border-t-blue-500 border-r-transparent border-slate-800 rounded-full animate-spin" />
          </div>
        ) : isSimulated ? (
          renderSimulatedPage(currentUrl)
        ) : (
          <div className="w-full h-full flex flex-col">
            {/* Overlay warning on X-Frame limitation in browsers */}
            <div className="bg-slate-900 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-400 shrink-0 select-text">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Note: Certain websites blocks iframe embedding (X-Frame-Options constraint). Feel free to use simulated bookmarks or open in a new browser tab.</span>
              </span>
              <a
                href={currentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline flex items-center gap-0.5 ml-2"
              >
                Open directly <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <iframe
              src={currentUrl}
              title="Browser Viewport"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              referrerPolicy="no-referrer"
              className="w-full flex-1 border-none bg-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
