import React, { useState } from 'react';
import { Download, Check, Trash2, Star, Sparkles, Shield, RefreshCw } from 'lucide-react';

export interface StoreAppDetails {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  category: 'Utility' | 'Productivity' | 'Entertainment' | 'System';
  description: string;
  size: string;
  rating: number;
  reviews: string[];
}

export const STORE_CATALOG: StoreAppDetails[] = [
  {
    id: 'calculator',
    title: 'Calculator OS',
    icon: 'calculator',
    iconColor: 'text-blue-400',
    category: 'Productivity',
    description: 'Fully featured calculator supporting core algebra, trigonometry, log scales, constants, and formula memory logs.',
    size: '1.2 MB',
    rating: 4.8,
    reviews: ['"The formula history is incredibly useful for classes!"', '"Sleek design, keys feel responsive."'],
  },
  {
    id: 'camera',
    title: 'Core Camera',
    icon: 'camera',
    iconColor: 'text-emerald-400',
    category: 'Utility',
    description: 'Take high-fidelity webcam pictures with futuristic live filters, snapshot capturing, grids, and native File Explorer storage.',
    size: '4.7 MB',
    rating: 4.9,
    reviews: ['"Cyberpunk filter is absolutely stunning!"', '"Saves directly into my file manager. Clean implementation."'],
  },
  {
    id: 'welcome',
    title: 'Welcome Info',
    icon: 'star',
    iconColor: 'text-amber-400',
    category: 'System',
    description: 'The core starter guide manual for onboarding users to BlackholeOS mechanics and customization configurations.',
    size: '0.4 MB',
    rating: 4.5,
    reviews: ['"Helpful explanation of the OS concepts."'],
  },
  {
    id: 'browser',
    title: 'Sandbox Browser',
    icon: 'globe',
    iconColor: 'text-blue-400',
    category: 'Utility',
    description: 'Warp through web urls in a fully sandboxed isolated container. Built-in security proxies.',
    size: '11.4 MB',
    rating: 4.7,
    reviews: ['"Very secure, and URL handling is swift."'],
  },
  {
    id: 'chatapp',
    title: 'Secure ChatApp',
    icon: 'message',
    iconColor: 'text-emerald-400',
    category: 'Entertainment',
    description: 'Peer-encrypted messaging rooms. Chat and coordinate with other terminals securely.',
    size: '3.1 MB',
    rating: 4.6,
    reviews: ['"Works great for secure file transfers and code sharing!"'],
  },
  {
    id: 'optimisme',
    title: 'Optimisme Suite',
    icon: 'sun',
    iconColor: 'text-amber-500',
    category: 'Entertainment',
    description: 'An AI-powered mood calibration deck that generates hyper-optimistic predictions, quotes, and visual cards.',
    size: '8.2 MB',
    rating: 4.9,
    reviews: ['"An instant dopamine booster when I am stuck on code!"', '"The quotes are surprisingly deep."'],
  },
  {
    id: 'supportphone',
    title: 'Support Phone',
    icon: 'phone',
    iconColor: 'text-emerald-400',
    category: 'System',
    description: 'A direct hotline connection to OS development, support operators, and dial-in diagnostic testers.',
    size: '0.8 MB',
    rating: 4.2,
    reviews: ['"Cool dialing sound, helpful testing suite."'],
  },
];

interface StoreAppProps {
  installedAppIds: string[];
  onInstallApp: (id: string) => void;
  onUninstallApp: (id: string) => void;
}

export default function StoreApp({ installedAppIds, onInstallApp, onUninstallApp }: StoreAppProps) {
  const [selectedApp, setSelectedApp] = useState<StoreAppDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'Utility' | 'Productivity' | 'Entertainment' | 'System'>('all');
  const [installProgress, setInstallProgress] = useState<Record<string, number>>({});
  const [reviewInput, setReviewInput] = useState('');

  const handleInstallClick = (appId: string) => {
    if (installedAppIds.includes(appId)) return;

    // Start a realistic simulated download
    setInstallProgress((prev) => ({ ...prev, [appId]: 1 }));
    
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        const curr = prev[appId] || 0;
        if (curr >= 100) {
          clearInterval(interval);
          onInstallApp(appId);
          return { ...prev, [appId]: 100 };
        }
        // Random incremental speed
        return { ...prev, [appId]: curr + Math.floor(Math.random() * 15) + 5 };
      });
    }, 200);
  };

  const filteredApps = activeTab === 'all' 
    ? STORE_CATALOG 
    : STORE_CATALOG.filter((app) => app.category === activeTab);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewInput.trim() || !selectedApp) return;

    // Local review addition
    selectedApp.reviews = [...selectedApp.reviews, `"${reviewInput.trim()}"`];
    setReviewInput('');
  };

  return (
    <div className="flex h-full bg-[#060813] text-white select-text font-sans">
      {/* Sidebar navigation */}
      <div className="w-48 bg-slate-950/70 border-r border-slate-900 flex flex-col shrink-0 select-none">
        <div className="p-4 border-b border-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-xs font-black tracking-widest text-slate-300">BLACKHOLE STORE</span>
        </div>
        <div className="p-2.5 space-y-1">
          {(['all', 'Utility', 'Productivity', 'Entertainment', 'System'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setSelectedApp(null); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-blue-600/15 border border-blue-500/30 text-blue-400 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* Secure badge footer */}
        <div className="mt-auto p-4 border-t border-slate-950 flex flex-col gap-1.5 bg-slate-950/40">
          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>K-COMPLIANT</span>
          </div>
          <span className="text-[9px] text-slate-500 font-mono leading-tight">All sandbox modules verified secure against kernel loops.</span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-h-0">
        {selectedApp ? (
          /* Detail App View */
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            {/* Back button */}
            <button
              onClick={() => setSelectedApp(null)}
              className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer select-none"
            >
              ← BACK TO CATALOG
            </button>

            {/* App overview card header */}
            <div className="flex gap-4 items-start pb-5 border-b border-slate-900">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-900 shadow shadow-black">
                <Star className={`w-8 h-8 ${selectedApp.iconColor}`} />
              </div>
              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-bold tracking-tight text-white">{selectedApp.title}</h2>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-blue-400">{selectedApp.category}</span>
                  <span>Size: {selectedApp.size}</span>
                  <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedApp.rating}</span>
                </div>
              </div>

              {/* Action install buttons */}
              <div>
                {installedAppIds.includes(selectedApp.id) ? (
                  <button
                    onClick={() => onUninstallApp(selectedApp.id)}
                    className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 font-bold font-mono text-xs rounded-xl border border-red-900/50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>UNINSTALL</span>
                  </button>
                ) : installProgress[selectedApp.id] !== undefined && installProgress[selectedApp.id] < 100 ? (
                  <div className="flex flex-col items-end gap-1 font-mono text-[10px]">
                    <div className="flex items-center gap-1.5 text-blue-400">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>DOWNLOADING {installProgress[selectedApp.id]}%</span>
                    </div>
                    <div className="w-32 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div className="bg-blue-500 h-full transition-all duration-150" style={{ width: `${installProgress[selectedApp.id]}%` }} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleInstallClick(selectedApp.id)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 hover:scale-102 active:scale-98 text-white font-bold font-mono text-xs rounded-xl shadow-lg shadow-blue-950 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>INSTALL FREE</span>
                  </button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono text-slate-400 tracking-wider">DESCRIPTION</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl font-sans">{selectedApp.description}</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-center font-mono space-y-1">
                <span className="text-[10px] text-slate-500">DEVELOPER</span>
                <p className="text-xs text-slate-300 font-bold">BLACKHOLE LABS</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-center font-mono space-y-1">
                <span className="text-[10px] text-slate-500">COMPATIBILITY</span>
                <p className="text-xs text-slate-300 font-bold">Blackhole v1.0.8</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-center font-mono space-y-1">
                <span className="text-[10px] text-slate-500">SECURITY RATING</span>
                <p className="text-xs text-emerald-400 font-bold">100% SECURE</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-900 text-center font-mono space-y-1">
                <span className="text-[10px] text-slate-500">LICENSE</span>
                <p className="text-xs text-amber-500 font-bold">OPEN SOURCE</p>
              </div>
            </div>

            {/* Interactive User Reviews */}
            <div className="space-y-4 pt-4 border-t border-slate-900">
              <h3 className="text-xs font-mono text-slate-400 tracking-wider">USER REVIEWS</h3>
              
              <div className="space-y-3">
                {selectedApp.reviews.map((rev, idx) => (
                  <div key={idx} className="p-3 bg-slate-950/30 border border-slate-900 rounded-xl text-xs space-y-1.5 max-w-xl">
                    <div className="flex justify-between font-mono text-[9px] text-slate-500">
                      <span>Verified User Terminal</span>
                      <span className="flex text-amber-400">★★★★★</span>
                    </div>
                    <p className="text-slate-300 italic font-sans">{rev}</p>
                  </div>
                ))}
              </div>

              {/* Add review form */}
              <form onSubmit={handleAddReview} className="flex gap-2 max-w-xl">
                <input
                  type="text"
                  placeholder="Write a quick terminal review..."
                  value={reviewInput}
                  onChange={(e) => setReviewInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-900 focus:outline-none focus:border-blue-500/50 font-sans"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl text-xs font-mono text-slate-300 cursor-pointer"
                >
                  Post Review
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Catalog list view */
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-5">
            <div className="flex justify-between items-center pb-2 border-b border-slate-950">
              <span className="text-[11px] font-mono tracking-widest text-slate-500 uppercase">{activeTab} App Modules</span>
              <span className="text-[10px] font-mono text-slate-500">{filteredApps.length} Packages cataloged</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApps.map((app) => {
                const isInstalled = installedAppIds.includes(app.id);
                const progress = installProgress[app.id];
                const isDownloading = progress !== undefined && progress < 100;

                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-950/40 border border-slate-900 hover:border-slate-800 hover:bg-slate-950/60 transition-all flex gap-4 cursor-pointer items-start relative overflow-hidden group"
                    onClick={() => setSelectedApp(app)}
                  >
                    {/* Tiny visual hover card overlay */}
                    <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

                    {/* App Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center border border-slate-900 shadow shrink-0">
                      <Star className={`w-6 h-6 ${app.iconColor}`} />
                    </div>

                    {/* App info */}
                    <div className="flex-1 min-h-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-100 truncate pr-2 font-mono">{app.title}</h4>
                        <span className="text-[9px] font-mono text-slate-500 shrink-0">{app.size}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">{app.description}</p>
                      
                      {/* Action trigger footer inside card */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{app.rating} rating</span>
                        </div>

                        {/* Direct installation or status badge */}
                        <div onClick={(e) => e.stopPropagation()}>
                          {isInstalled ? (
                            <span className="text-[10px] font-bold font-mono text-emerald-400 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>INSTALLED</span>
                            </span>
                          ) : isDownloading ? (
                            <div className="flex items-center gap-1 font-mono text-[9px] text-blue-400">
                              <span>DOWNLOADING {progress}%</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleInstallClick(app.id)}
                              className="px-2.5 py-1 text-[10px] font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer"
                            >
                              GET
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
