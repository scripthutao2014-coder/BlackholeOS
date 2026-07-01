import { useState, useEffect } from 'react';
import { Wallpaper, AccentColor, SystemSettings, UserSession } from '../../types';
import { INITIAL_WALLPAPERS } from '../../constants';
import { Laptop, Palette, User, ShieldCheck, Cpu, HardDrive, RefreshCw } from 'lucide-react';

interface SettingsAppProps {
  settings: SystemSettings;
  session: UserSession;
  onUpdateSettings: (settings: SystemSettings) => void;
  onUpdateSession: (session: UserSession) => void;
}

export default function SettingsApp({ settings, session, onUpdateSettings, onUpdateSession }: SettingsAppProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'account' | 'system'>('appearance');
  const [usernameInput, setUsernameInput] = useState(session.username);
  
  // Simulated dynamic CPU stats for visual diagnostics
  const [cpuLoad, setCpuLoad] = useState(3.4);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(20).fill(3));
  const [ramUsed, setRamUsed] = useState(112.5); // MB used out of 2048MB

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate extremely light load fluctuating slightly
      const nextCpu = +(1.5 + Math.random() * 4).toFixed(1);
      setCpuLoad(nextCpu);
      setCpuHistory(prev => {
        const nextHist = [...prev.slice(1), nextCpu];
        return nextHist;
      });

      // Simulate minor RAM fluctuation (proving lightweight optimization)
      setRamUsed(prev => +(112 + Math.sin(Date.now() / 10000) * 1.5).toFixed(1));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleWallpaperChange = (id: string) => {
    onUpdateSettings({ ...settings, wallpaperId: id });
  };

  const handleAccentChange = (color: AccentColor) => {
    onUpdateSettings({ ...settings, accentColor: color });
  };

  const handleSaveUsername = () => {
    if (!usernameInput.trim()) return;
    onUpdateSession({ ...session, username: usernameInput.trim() });
    alert('ExtinctionIBT username updated successfully!');
  };

  // Render CPU historical wave
  const getSvgPath = (data: number[]) => {
    const width = 180;
    const height = 40;
    const maxVal = 10; // max CPU simulated
    const points = data.map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - (val / maxVal) * height;
      return `${x},${y}`;
    });
    return `M0,${height} L${points.join(' L')} L${width},${height} Z`;
  };

  return (
    <div className="h-full w-full bg-slate-950/40 flex font-sans select-none overflow-hidden text-slate-300">
      {/* Settings Navigation Sidebar */}
      <div className="w-48 bg-slate-900 border-r border-slate-800/85 p-3 flex flex-col gap-1.5 shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-2.5">
          Control Panel
        </span>
        
        <button
          onClick={() => setActiveTab('appearance')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'appearance' 
              ? 'bg-blue-600/15 text-blue-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'account' 
              ? 'bg-blue-600/15 text-blue-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Account Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
            activeTab === 'system' 
              ? 'bg-blue-600/15 text-blue-400 font-medium' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>System Diagnost</span>
        </button>
      </div>

      {/* Settings Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 bg-[#060810] select-text">
        {activeTab === 'appearance' && (
          <div className="space-y-6 animate-fade-in pb-8">
            <div>
              <h2 className="text-xl font-bold font-display text-white">Appearance & Customization</h2>
              <p className="text-xs text-slate-400 mt-1">Configure your workspace environment, window styles, desktop wallpapers, and taskbar geometry.</p>
            </div>

            {/* Accent selection */}
            <div className="space-y-2.5 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <span className="text-xs font-semibold text-white block">System Accent Color</span>
              <div className="flex gap-4">
                {(['blue', 'green', 'white'] as AccentColor[]).map((col) => (
                  <button
                    key={col}
                    onClick={() => handleAccentChange(col)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs capitalize transition-all cursor-pointer ${
                      settings.accentColor === col
                        ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                        : 'border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col === 'blue' ? 'bg-blue-500' : col === 'green' ? 'bg-emerald-500' : 'bg-slate-100'
                    }`} />
                    <span>{col}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Taskbar Alignment & Clock Format */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Taskbar layout */}
              <div className="space-y-2.5 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
                <span className="text-xs font-semibold text-white block">Taskbar Layout Style</span>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => onUpdateSettings({ ...settings, dockAlignment: 'center' })}
                    className={`flex-1 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      settings.dockAlignment !== 'left'
                        ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                        : 'border-slate-800 text-slate-400 hover:border-slate-750'
                    }`}
                  >
                    Centered (Win 11)
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ ...settings, dockAlignment: 'left' })}
                    className={`flex-1 py-2 rounded-lg border text-xs transition-all cursor-pointer ${
                      settings.dockAlignment === 'left'
                        ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                        : 'border-slate-800 text-slate-400 hover:border-slate-750'
                    }`}
                  >
                    Left Align
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">Windows 11 centers standard launchers, while left-align mimics vintage systems.</p>
              </div>

              {/* Window theme decoration */}
              <div className="space-y-2.5 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
                <span className="text-xs font-semibold text-white block">System Theme Style</span>
                <div className="flex gap-2">
                  {(['glass', 'solid', 'retro-terminal'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => onUpdateSettings({ ...settings, themeStyle: style })}
                      className={`flex-1 py-1.5 rounded-lg border text-[11px] capitalize transition-all cursor-pointer ${
                        (settings.themeStyle || 'glass') === style
                          ? 'border-blue-500 bg-blue-500/10 text-white font-semibold'
                          : 'border-slate-800 text-slate-400 hover:border-slate-750'
                      }`}
                    >
                      {style === 'retro-terminal' ? 'Retro' : style}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">Alters background translucency thresholds and active border glow profiles.</p>
              </div>
            </div>

            {/* Performance and Clock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Animations */}
              <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-white block">Disable Default Animations</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Stops CSS transition delays to speed up system rendering.</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!settings.disableAnimations}
                  onChange={(e) => onUpdateSettings({ ...settings, disableAnimations: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl">
                <div>
                  <span className="text-xs font-semibold text-white block">Use 24-Hour Clock Format</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Toggles between 24-hour military notation and standard 12-hour AM/PM.</span>
                </div>
                <input
                  type="checkbox"
                  checked={!!settings.clockFormat24h}
                  onChange={(e) => onUpdateSettings({ ...settings, clockFormat24h: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-slate-950 border-slate-800 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Custom Wallpapers paste inputs */}
            <div className="space-y-3 bg-slate-900/40 border border-slate-800/60 p-4 rounded-xl">
              <span className="text-xs font-semibold text-white block">Local Custom Wallpapers</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Input URL */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">Custom Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Paste image url (https://...)"
                      value={settings.customWallpaperUrl || ''}
                      onChange={(e) => {
                        const url = e.target.value;
                        onUpdateSettings({ 
                          ...settings, 
                          customWallpaperUrl: url, 
                          wallpaperId: 'custom-image' 
                        });
                      }}
                      className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none w-full font-mono focus:border-blue-500/40"
                    />
                    <button
                      onClick={() => onUpdateSettings({ ...settings, wallpaperId: 'custom-image' })}
                      className={`px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg cursor-pointer ${settings.wallpaperId === 'custom-image' ? 'ring-1 ring-blue-500 bg-blue-950/40' : ''}`}
                    >
                      Apply
                    </button>
                  </div>
                </div>

                {/* Input Color */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">Custom Solid Color (Hex/CSS)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="#090d16 or linear-gradient(...)"
                      value={settings.customWallpaperColor || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateSettings({ 
                          ...settings, 
                          customWallpaperColor: val, 
                          wallpaperId: 'custom-color' 
                        });
                      }}
                      className="bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 outline-none w-full font-mono focus:border-blue-500/40"
                    />
                    <button
                      onClick={() => onUpdateSettings({ ...settings, wallpaperId: 'custom-color' })}
                      className={`px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs text-white rounded-lg cursor-pointer ${settings.wallpaperId === 'custom-color' ? 'ring-1 ring-blue-500 bg-blue-950/40' : ''}`}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500">Alternatively, you can open the <b>File Manager (Files)</b>, select any text file containing a valid image web URL, and click <b>"Set Background"</b> to apply it locally instantly!</p>
            </div>

            {/* Wallpapers Grid */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-white block">Event Horizon Wallpaper Presets</span>
              <div className="grid grid-cols-2 gap-3">
                {INITIAL_WALLPAPERS.map((wall) => {
                  const isSelected = settings.wallpaperId === wall.id;
                  return (
                    <div
                      key={wall.id}
                      onClick={() => handleWallpaperChange(wall.id)}
                      className={`group cursor-pointer rounded-xl border p-2 flex flex-col gap-2 transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-500/5' 
                          : 'border-slate-800 bg-slate-900/30 hover:border-slate-700'
                      }`}
                    >
                      <div className={`h-20 w-full rounded-lg ${wall.previewClass} border border-slate-950/40 overflow-hidden relative`}>
                        {wall.type === 'canvas' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 rounded-full bg-black border border-blue-500/40 animate-pulse" />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center px-1">
                        <span className={`text-[11px] font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {wall.name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-blue-600/15 border border-blue-500/30 text-blue-400 px-1.5 py-0.5 rounded-md font-mono">
                            Active
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">ExtinctionIBT Profile Control</h2>
              <p className="text-xs text-slate-400 mt-1">Manage your centralized sandbox login session and cryptographic variables.</p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-tr from-slate-950 to-blue-900 rounded-full border border-slate-800 flex items-center justify-center font-bold text-white text-xl">
                  {session.username.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Authorized Account ID</h4>
                  <span className="text-xs text-slate-500 font-mono">IBT-NODE-593-SECURE</span>
                </div>
              </div>

              <div className="h-px bg-slate-800/60" />

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block">Edit System Handle</label>
                <div className="flex gap-2 max-w-sm">
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none w-full font-mono focus:border-blue-500/40"
                  />
                  <button
                    onClick={handleSaveUsername}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Update Name
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs">
                  <span className="text-white font-medium block">Remember Login Token</span>
                  <span className="text-[10px] text-slate-500">Enable caching of this login token in browser storage.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.rememberLogin}
                  onChange={(e) => onUpdateSettings({ ...settings, rememberLogin: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-slate-900 border-slate-800 rounded focus:ring-blue-500 focus:ring-2 focus:ring-offset-slate-950"
                />
              </div>
            </div>

            {/* Account security card */}
            <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <span className="font-bold text-white block mb-0.5">Derivation Shield: ACTIVE</span>
                All sandbox variables are encrypted using high-density, client-side derivation indexes. Your ExtinctionIBT communications remain strictly locked inside standard web sessionStorage.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-display text-white">System Information</h2>
              <p className="text-xs text-slate-400 mt-1">Diagnostic hardware readings optimized for low-end system environments.</p>
            </div>

            {/* Static specifications */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/30 p-3.5 border border-slate-800/60 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Platform</span>
                <span className="text-sm font-semibold text-white mt-1 block">BlackholeOS</span>
              </div>
              <div className="bg-slate-900/30 p-3.5 border border-slate-800/60 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Release</span>
                <span className="text-sm font-semibold text-white mt-1 block">1.0.0 Stable</span>
              </div>
              <div className="bg-slate-900/30 p-3.5 border border-slate-800/60 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">RAM ALLOCATION</span>
                <span className="text-sm font-semibold text-white mt-1 block">2.00 GB (2048M)</span>
              </div>
              <div className="bg-slate-900/30 p-3.5 border border-slate-800/60 rounded-xl text-center">
                <span className="text-[10px] text-slate-500 uppercase block font-mono">KERNEL LATENCY</span>
                <span className="text-sm font-semibold text-emerald-400 mt-1 block font-mono">0.05 ms</span>
              </div>
            </div>

            {/* Animated Performance Monitors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CPU load card */}
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    CPU Singularity Threads
                  </span>
                  <span className="text-xs text-blue-400 font-mono">{cpuLoad}%</span>
                </div>

                {/* SVG Line Graph */}
                <div className="h-10 w-full bg-slate-950 rounded-lg border border-slate-850 overflow-hidden flex items-end">
                  <svg className="w-full h-full" viewBox="0 0 180 40" preserveAspectRatio="none">
                    <path
                      d={getSvgPath(cpuHistory)}
                      fill="rgba(59, 130, 246, 0.12)"
                      stroke="rgba(59, 130, 246, 0.7)"
                      strokeWidth="1"
                    />
                  </svg>
                </div>

                <p className="text-[10px] text-slate-500 leading-normal">
                  Dynamic thread load distributing smoothly across your browser sandbox. Optimizations are active to prevent UI micro-stutters.
                </p>
              </div>

              {/* Memory RAM card */}
              <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-white flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    Sandbox Memory (RAM)
                  </span>
                  <span className="text-xs text-emerald-400 font-mono">{ramUsed} MB / 2048 MB</span>
                </div>

                {/* Simulated static memory bar */}
                <div className="space-y-1.5">
                  <div className="w-full bg-slate-950 border border-slate-850 h-3 rounded-md overflow-hidden p-0.5">
                    <div className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-sm" style={{ width: `${(ramUsed / 2048) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                    <span>0M</span>
                    <span>1024M</span>
                    <span>2048M</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-normal">
                  BlackholeOS active memory footprint: <span className="text-emerald-400/90 font-semibold font-mono">~5.4%</span> of total 2GB threshold. Garbage collection loops are purging unused window states successfully.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
