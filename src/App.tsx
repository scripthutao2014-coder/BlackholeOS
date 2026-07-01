import React, { useState, useEffect, useRef } from 'react';
import { 
  WindowInstance, FileSystem, SystemSettings, UserSession, AppID 
} from './types';
import { INITIAL_FILE_SYSTEM, INITIAL_WALLPAPERS } from './constants';
import BlackholeBackground from './components/BlackholeBackground';
import Window from './components/Window';
import OOBESetup from './components/OOBESetup';

// Import apps
import WelcomeApp from './components/apps/WelcomeApp';
import BrowserApp from './components/apps/BrowserApp';
import ChatAppLauncher from './components/apps/ChatAppLauncher';
import FileExplorer from './components/apps/FileExplorer';
import SettingsApp from './components/apps/SettingsApp';
import SecurityHub from './components/apps/SecurityHub';
import OptimismeApp from './components/apps/OptimismeApp';
import CameraApp from './components/apps/CameraApp';
import StoreApp from './components/apps/StoreApp';
import DynamicIsland from './components/DynamicIsland';
import { motion, AnimatePresence } from 'motion/react';

// Import icons
import { 
  Folder, Globe, MessageSquare, Settings, ShieldCheck, Star,
  LogOut, Power, Volume2, Wifi, Battery, Clock, Search,
  Terminal, ShieldAlert, Monitor, ChevronUp, User, AppWindow, Play,
  RefreshCw, Sun, Camera, ShoppingBag, X, Trash2, AlertCircle, ArrowRight
} from 'lucide-react';

export default function App() {
  // OS Boot/Session States
  const [systemState, setSystemState] = useState<'booting' | 'setup' | 'login' | 'desktop' | 'locked'>('booting');
  const [bootProgress, setBootProgress] = useState(0);
  const [bootLog, setBootLog] = useState('Initializing system drivers...');

  // Lockscreen & Shutdown Custom states
  const [lockscreenWallpaperIdx, setLockscreenWallpaperIdx] = useState(0);
  const [lockscreenPassword, setLockscreenPassword] = useState('');
  const [lockscreenError, setLockscreenError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [emergencyPurgeOpen, setEmergencyPurgeOpen] = useState(false);
  const [shutdownPopupOpen, setShutdownPopupOpen] = useState(false);
  
  // Settings & Themes
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('blackhole_settings');
    return saved ? JSON.parse(saved) : {
      accentColor: 'blue',
      wallpaperId: 'singularity',
      rememberLogin: true,
    };
  });

  // User Profile
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('blackhole_session');
    return saved ? JSON.parse(saved) : {
      username: 'ibt_guest',
      isLoggedIn: false,
      avatarSeed: 'duck_master',
    };
  });

  // File System State
  const [fileSystem, setFileSystem] = useState<FileSystem>(() => {
    const saved = localStorage.getItem('blackhole_filesystem');
    return saved ? JSON.parse(saved) : INITIAL_FILE_SYSTEM;
  });

  // Window Management
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);
  const zIndexCounter = useRef(100);

  // OS Interface Toggles
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [quickPanelOpen, setQuickPanelOpen] = useState(false);
  const [systemTrayClock, setSystemTrayClock] = useState('');
  const [systemTrayDate, setSystemTrayDate] = useState('');
  const [searchText, setSearchText] = useState('');

  // Draggable Shortcuts State
  const [shortcutPositions, setShortcutPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const saved = localStorage.getItem('blackhole_shortcut_positions');
    if (saved) return JSON.parse(saved);
    return {
      welcome: { x: 25, y: 30 },
      files: { x: 25, y: 135 },
      browser: { x: 25, y: 240 },
      chatapp: { x: 25, y: 345 },
      settings: { x: 25, y: 450 },
      security: { x: 125, y: 30 },
      optimisme: { x: 125, y: 135 },
      camera: { x: 125, y: 240 },
      store: { x: 125, y: 345 },
    };
  });
  const [draggingShortcutId, setDraggingShortcutId] = useState<string | null>(null);
  const dragShortcutOffset = useRef({ x: 0, y: 0 });

  // Dynamic App Store & Workspace States
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('blackhole_installed_apps');
    if (saved) return JSON.parse(saved);
    // Core apps and new apps installed by default
    return ['welcome', 'files', 'browser', 'chatapp', 'settings', 'security', 'optimisme', 'camera', 'store'];
  });

  const [isBackgroundPaused, setIsBackgroundPaused] = useState(false);
  const [isHoveringWindow, setIsHoveringWindow] = useState(false);
  const [taskSwitcherOpen, setTaskSwitcherOpen] = useState(false);

  // Active permissions (Privacy Indicators)
  const [activePermissions, setActivePermissions] = useState({
    camera: { active: false, appName: '' },
    microphone: { active: false, appName: '' },
    screenRecording: { active: false, appName: '' },
  });

  // Login inputs
  const [usernameInput, setUsernameInput] = useState(session.username);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('blackhole_installed_apps', JSON.stringify(installedAppIds));
  }, [installedAppIds]);

  useEffect(() => {
    localStorage.setItem('blackhole_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('blackhole_session', JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    localStorage.setItem('blackhole_filesystem', JSON.stringify(fileSystem));
  }, [fileSystem]);

  useEffect(() => {
    localStorage.setItem('blackhole_shortcut_positions', JSON.stringify(shortcutPositions));
  }, [shortcutPositions]);

  // Double-space Task Switcher detection
  useEffect(() => {
    let lastSpaceTime = 0;
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Trigger only if key is Space and cursor is on desktop background (isHoveringWindow is false)
      // And we are not typing in any text input/textarea fields
      if (e.key === ' ' || e.key === 'Spacebar') {
        const activeTag = document.activeElement?.tagName;
        const isEditing = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement?.getAttribute('contenteditable') === 'true';
        
        if (!isHoveringWindow && !isEditing) {
          const now = Date.now();
          if (now - lastSpaceTime < 450) {
            // Prevent default scroll
            e.preventDefault();
            setTaskSwitcherOpen(prev => !prev);
            lastSpaceTime = 0; // Reset
          } else {
            lastSpaceTime = now;
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isHoveringWindow]);

  // B + S Keyboard shortcut detection for Shutdown/Lock Pop-up
  useEffect(() => {
    const activeKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      const isEditing = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || document.activeElement?.getAttribute('contenteditable') === 'true';
      if (isEditing) return;

      activeKeys.add(e.key.toLowerCase());

      if (activeKeys.has('b') && activeKeys.has('s')) {
        e.preventDefault();
        setShutdownPopupOpen(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      activeKeys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Hotkeys handling for Confirm/Cancel Shutdown Pop-up (Enter / Escape)
  useEffect(() => {
    if (!shutdownPopupOpen) return;

    const handleConfirmKeys = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        setSystemState('locked');
        setShutdownPopupOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShutdownPopupOpen(false);
      }
    };

    window.addEventListener('keydown', handleConfirmKeys);
    return () => window.removeEventListener('keydown', handleConfirmKeys);
  }, [shutdownPopupOpen]);

  // Background cycling for Lock Screen
  useEffect(() => {
    if (systemState !== 'locked') return;
    const interval = setInterval(() => {
      setLockscreenWallpaperIdx(prev => (prev + 1) % INITIAL_WALLPAPERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [systemState]);

  // Clock updating
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = settings.clockFormat24h 
        ? { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }
        : { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
      setSystemTrayClock(now.toLocaleTimeString([], options));
      setSystemTrayDate(now.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.clockFormat24h]);

  // Boot progress simulator
  useEffect(() => {
    if (systemState !== 'booting') return;

    const logs = [
      'BOOT DRIVER CORE LOADED SUCCESFULLY [0.001s]',
      'ENABLING MICRO-KERNEL MEMORY THREADS...',
      'OPTIMIZING HEAP FOOTPRINT (2GB LOW-END RAM PROFILES ACTIVE)...',
      'LAUNCHING EVENT HORIZON GRAPHICS BUFFER [OK]',
      'INSULATING SECURE VIRTUAL DIRECTORIES...',
      'MOUNTING SANDBOX STORAGE DRIVES (S:)...',
      'ESTABLISHING SHIELD HANDSHAKE (Derivation derived flags: ON)...',
      'ExtinctionIBT NETWORK ATTAINED: READY.',
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          const isSetupCompleted = localStorage.getItem('blackhole_setup_completed') === 'true';
          if (!isSetupCompleted) {
            setSystemState('setup');
          } else if (settings.rememberLogin && session.isLoggedIn) {
            setSystemState('desktop');
            // Auto open welcome app
            openApp('welcome', 'Welcome Manual', 'star');
          } else {
            setSystemState('login');
          }
        }, 800);
      }
      setBootProgress(progress);
      
      // Update boot logs based on progress ranges
      const logIdx = Math.min(Math.floor((progress / 100) * logs.length), logs.length - 1);
      setBootLog(logs[logIdx]);
    }, 180);

    return () => clearInterval(interval);
  }, [systemState]);

  // Window actions
  const openApp = (appId: AppID, title: string, iconName: string) => {
    setStartMenuOpen(false);
    
    // Check if window is already open
    const existing = windows.find(w => w.appId === appId);
    if (existing) {
      if (existing.isMinimized) {
        // Restore minimized window
        setWindows(prev => prev.map(w => w.appId === appId ? { ...w, isMinimized: false } : w));
      }
      focusWindow(existing.id);
      return;
    }

    // Spawn new window centered with offset
    zIndexCounter.current += 1;
    const offset = (windows.length * 25) % 150;
    const nextWidth = Math.min(780, window.innerWidth - 60);
    const nextHeight = Math.min(500, window.innerHeight - 120);
    const startX = Math.max(30, (window.innerWidth - nextWidth) / 2 + offset);
    const startY = Math.max(20, (window.innerHeight - nextHeight) / 2 - 20 + offset);

    const newWin: WindowInstance = {
      id: `${appId}_${Date.now()}`,
      appId,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: appId === 'chatapp', // ChatApp maximizes by default for rich layout
      zIndex: zIndexCounter.current,
      x: startX,
      y: startY,
      width: nextWidth,
      height: nextHeight,
    };

    setWindows(prev => [...prev, newWin]);
    setFocusedWindowId(newWin.id);
  };

  const focusWindow = (id: string) => {
    zIndexCounter.current += 1;
    setFocusedWindowId(id);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: zIndexCounter.current, isMinimized: false } : w));
  };

  const minimizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (focusedWindowId === id) {
      setFocusedWindowId(null);
    }
    setIsBackgroundPaused(false);
    setIsHoveringWindow(false);
  };

  const maximizeWindow = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (focusedWindowId === id) {
      setFocusedWindowId(null);
    }
    setIsBackgroundPaused(false);
    setIsHoveringWindow(false);
  };

  const updateWindowPosition = (id: string, x: number, y: number, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y, width, height } : w));
  };

  // Auth Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setLoginError('Username ID tidak boleh kosong');
      return;
    }

    const savedPassword = localStorage.getItem('blackhole_user_password') || '';
    if (passwordInput !== savedPassword) {
      setLoginError('Access Cyphercode Invalid (Kata sandi salah)');
      return;
    }

    setIsAuthenticating(true);
    setLoginError('');

    // Simulate safe cryptographic handshake lookup
    setTimeout(() => {
      setIsAuthenticating(false);
      setSession({
        username: usernameInput.trim(),
        isLoggedIn: true,
        avatarSeed: 'duck_master',
      });
      setSystemState('desktop');
      // Auto-launch welcome tutorial
      openApp('welcome', 'Welcome Manual', 'star');
    }, 1500);
  };

  const handleLockscreenUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('blackhole_user_password') || '';
    if (lockscreenPassword === savedPassword) {
      setIsUnlocking(true);
      setLockscreenError('');
      setTimeout(() => {
        setIsUnlocking(false);
        setSystemState('desktop');
        setLockscreenPassword('');
      }, 1000);
    } else {
      setLockscreenError('Kata sandi salah! Coba ulangi kembali.');
      setLockscreenPassword('');
    }
  };

  const handleLogout = () => {
    setSession(prev => ({ ...prev, isLoggedIn: false }));
    setWindows([]);
    setSystemState('login');
    setStartMenuOpen(false);
  };

  const handleShutdown = () => {
    setWindows([]);
    setBootProgress(0);
    setSystemState('booting');
    setStartMenuOpen(false);
  };

  const handleClearSession = () => {
    localStorage.removeItem('blackhole_settings');
    localStorage.removeItem('blackhole_session');
    localStorage.removeItem('blackhole_filesystem');
    localStorage.removeItem('blackhole_setup_completed');
    localStorage.removeItem('blackhole_user_password');
    localStorage.removeItem('blackhole_user_country');
    localStorage.removeItem('blackhole_user_email');
    localStorage.removeItem('blackhole_installed_apps');
    localStorage.removeItem('blackhole_shortcut_positions');
    window.location.reload();
  };

  // Icon mapping helper
  const renderAppIcon = (appId: AppID, className = "w-5 h-5") => {
    switch (appId) {
      case 'welcome': return <Star className={`${className} text-amber-400`} />;
      case 'browser': return <Globe className={`${className} text-blue-400`} />;
      case 'chatapp': return <MessageSquare className={`${className} text-emerald-400`} />;
      case 'files': return <Folder className={`${className} text-amber-500`} />;
      case 'settings': return <Settings className={`${className} text-indigo-400`} />;
      case 'security': return <ShieldCheck className={`${className} text-emerald-400`} />;
      case 'optimisme': return <Sun className={`${className} text-amber-500 animate-spin-slow`} />;
      case 'camera': return <Camera className={`${className} text-emerald-400`} />;
      case 'store': return <ShoppingBag className={`${className} text-indigo-400`} />;
      default: return <AppWindow className={className} />;
    }
  };

  // Search Results helper
  const allApps: { id: AppID; title: string; desc: string; icon: string }[] = [
    { id: 'welcome' as AppID, title: 'Welcome Manual', desc: 'Operating system instructions and mascot guides.', icon: 'star' },
    { id: 'browser' as AppID, title: 'holeBrowser', desc: 'Secure browsing sandbox and internal research.', icon: 'globe' },
    { id: 'chatapp' as AppID, title: 'Secure ChatApp', desc: 'Linked live ExtinctionIBT communications node.', icon: 'message' },
    { id: 'files' as AppID, title: 'File Manager', desc: 'Explore virtual volumes and edit text logs.', icon: 'folder' },
    { id: 'settings' as AppID, title: 'Settings Application', desc: 'Appearance colors, wallpapers, and diagnostics.', icon: 'settings' },
    { id: 'security' as AppID, title: 'Security Compliance', desc: 'End-to-End Cryptography and storage purges.', icon: 'security' },
    { id: 'optimisme' as AppID, title: 'Optimisme Suite', desc: 'Maintain deep-space positive outlook and self-regulation.', icon: 'sun' },
    { id: 'camera' as AppID, title: 'Core Camera', desc: 'Take photo snapshots with live cyberpunk and retro filters.', icon: 'camera' },
    { id: 'store' as AppID, title: 'Blackhole Store', desc: 'Install and manage native applications.', icon: 'store' },
  ].filter(app => installedAppIds.includes(app.id));

  const searchResults = searchText.trim() 
    ? allApps.filter(a => a.title.toLowerCase().includes(searchText.toLowerCase()) || a.desc.toLowerCase().includes(searchText.toLowerCase()))
    : [];

  // Accent helper classes
  const getAccentBorderClass = () => {
    if (settings.accentColor === 'green') return 'border-emerald-500/30 hover:border-emerald-500/50';
    if (settings.accentColor === 'white') return 'border-slate-500/30 hover:border-slate-500/50';
    return 'border-blue-500/30 hover:border-blue-500/50';
  };

  const getAccentBgClass = () => {
    if (settings.accentColor === 'green') return 'bg-emerald-500';
    if (settings.accentColor === 'white') return 'bg-slate-200 text-black';
    return 'bg-blue-600';
  };

  const getAccentTextClass = () => {
    if (settings.accentColor === 'green') return 'text-emerald-400';
    if (settings.accentColor === 'white') return 'text-slate-100';
    return 'text-blue-400';
  };

  const getActiveWallpaper = () => {
    const found = INITIAL_WALLPAPERS.find(w => w.id === settings.wallpaperId);
    if (found) return found;
    if (settings.wallpaperId === 'custom-image') {
      return {
        id: 'custom-image',
        name: 'Custom Wallpaper',
        type: 'image' as any,
        value: settings.customWallpaperUrl || '',
        previewClass: 'bg-slate-900',
      };
    }
    if (settings.wallpaperId === 'custom-color') {
      return {
        id: 'custom-color',
        name: 'Custom Color',
        type: 'solid' as any,
        value: settings.customWallpaperColor || '#020205',
        previewClass: 'bg-slate-900',
      };
    }
    return INITIAL_WALLPAPERS[0];
  };

  return (
    <div className="h-full w-full overflow-hidden select-none relative bg-black text-slate-200">
      <AnimatePresence mode="wait">
        {/* 1. BOOT SCREEN */}
        {systemState === 'booting' && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50 animate-fade-in"
          >
            <BlackholeBackground mode="boot" />
            
            <div className="z-10 flex flex-col items-center max-w-sm px-6 text-center">
              {/* Spinning vector halo logo */}
              <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-t-emerald-400 border-b-blue-500 rounded-full animate-spin duration-3000" />
                <div className="absolute inset-2 border-2 border-emerald-500/20 border-r-emerald-400 rounded-full animate-spin duration-1500" />
                <div className="absolute inset-4 border border-blue-500/10 border-l-blue-400 rounded-full animate-spin duration-1000" />
                <span className="font-display font-black text-white text-3xl tracking-widest leading-none drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]">
                  B
                </span>
              </div>

              <h1 className="text-xl font-bold tracking-widest font-display text-white mb-1.5 uppercase glow-blue">
                BLACKHOLE OS
              </h1>
              <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase block mb-12">
                QUANTUM MICRO-KERNEL V1.0
              </span>

              {/* Progress load bars */}
              <div className="w-64 bg-slate-900 border border-slate-800 rounded-full h-3 p-0.5 overflow-hidden shadow-inner mb-3">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-150"
                  style={{ width: `${bootProgress}%` }}
                />
              </div>

              <div className="h-10 text-left w-full mt-2 bg-black/40 border border-slate-900 rounded p-1.5 overflow-hidden">
                <span className="font-mono text-[9px] text-emerald-400 block whitespace-nowrap overflow-ellipsis">
                  {bootProgress === 100 ? 'SUCCESS. ROUTING MEMORY MATRIX...' : bootLog}
                </span>
              </div>
              
              <span className="font-mono text-[9px] text-slate-600 mt-2">
                Memory: 2048M allocated | Sandbox protected
              </span>
            </div>
          </motion.div>
        )}

        {/* 1.5. FIRST-TIME SETUP OOBE WIZARD */}
        {systemState === 'setup' && (
          <OOBESetup
            key="setup"
            onComplete={({ country, email, username, passwordInput }) => {
              localStorage.setItem('blackhole_setup_completed', 'true');
              localStorage.setItem('blackhole_user_country', country);
              localStorage.setItem('blackhole_user_email', email);
              localStorage.setItem('blackhole_user_password', passwordInput);
              
              // Seed the session with user credentials
              setSession({
                username: username,
                isLoggedIn: true,
                avatarSeed: 'duck_master',
              });
              setUsernameInput(username);
              setSystemState('desktop');
              openApp('welcome', 'Welcome Manual', 'star');
            }}
          />
        )}

        {/* 2. SECURITY AUTHORIZATION LOGIN PORTAL */}
        {systemState === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center bg-[#010103] z-40 select-text"
          >
            <BlackholeBackground mode="login" />

            {/* Glowing orbital sphere in background */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-radial from-blue-900/10 via-transparent to-transparent pointer-events-none filter blur-2xl animate-pulse" />

            {/* Glassmorphic card login */}
            <div className="z-10 w-full max-w-sm p-7 mx-4 rounded-3xl glass-panel-heavy shadow-2xl border border-slate-800/80 backdrop-blur-xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-slate-950 border border-slate-800 rounded-full flex items-center justify-center shadow-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-5 pt-4">
                <div className="text-center">
                  <h2 className="text-lg font-bold font-display text-white tracking-wide">
                    ExtinctionIBT Account Node
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Authenticate sandbox communications channel</p>
                </div>

                {loginError && (
                  <div className="p-2.5 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-400 text-center font-mono">
                    {loginError}
                  </div>
                )}

                {/* Username Input */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Username ID
                  </label>
                  <div className="bg-slate-950/80 border border-slate-850 focus-within:border-blue-500/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2 transition-all">
                    <User className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="ibt_guest"
                      className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                      disabled={isAuthenticating}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Access Cyphercode
                  </label>
                  <div className="bg-slate-950/80 border border-slate-850 focus-within:border-blue-500/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2 transition-all">
                    <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                    <input
                      type="password"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                      disabled={isAuthenticating}
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-slate-400 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.rememberLogin}
                      onChange={(e) => setSettings({ ...settings, rememberLogin: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 bg-slate-950 border-slate-850"
                    />
                    <span>Remember Session</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Derivation: Active</span>
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-medium rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-blue-900/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Sealing handshake...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Authorize Login</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer credentials info */}
            <div className="absolute bottom-6 font-mono text-[9px] text-slate-600 uppercase text-center tracking-widest">
              BlackholeOS Sandbox Isolation Hypervisor | Compliant v1.0
            </div>
          </motion.div>
        )}

        {/* 3. DESKTOP SYSTEM ENVIRONMENT */}
        {(systemState === 'desktop' || systemState === 'locked') && (
          <motion.div 
            key="desktop"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              background: getActiveWallpaper().type === 'canvas' 
                ? '#010204' 
                : getActiveWallpaper().type === 'image'
                  ? `url("${getActiveWallpaper().value}") no-repeat center center / cover`
                  : getActiveWallpaper().value,
            }}
            className="w-full h-full relative overflow-hidden bg-grid"
            onMouseMove={(e) => {
              if (!draggingShortcutId) return;
              const nextX = Math.max(10, Math.min(window.innerWidth - 90, e.clientX - dragShortcutOffset.current.x));
              const nextY = Math.max(10, Math.min(window.innerHeight - 150, e.clientY - dragShortcutOffset.current.y));
              setShortcutPositions(prev => ({
                ...prev,
                [draggingShortcutId]: { x: nextX, y: nextY }
              }));
            }}
            onMouseUp={() => {
              if (draggingShortcutId) {
                setDraggingShortcutId(null);
              }
            }}
            onMouseLeave={() => {
              if (draggingShortcutId) {
                setDraggingShortcutId(null);
              }
            }}
          >
          {/* Real-time custom Canvas background singularity render */}
          {/* Real-time custom Canvas background singularity render */}
          {getActiveWallpaper().type === 'canvas' && (
            <BlackholeBackground mode="desktop" accentColor={settings.accentColor} isPaused={isBackgroundPaused} />
          )}

          {/* Draggable Desktop App Shortcuts */}
          <div className="absolute inset-0 p-5 pt-8 pointer-events-none z-10">
            {[
              { id: 'welcome', title: 'Welcome Info', icon: 'star', onClick: () => openApp('welcome', 'Welcome Manual', 'star') },
              { id: 'files', title: 'File Manager', icon: 'folder', onClick: () => openApp('files', 'File Manager', 'folder') },
              { id: 'browser', title: 'holeBrowser', icon: 'globe', onClick: () => openApp('browser', 'holeBrowser', 'globe') },
              { id: 'chatapp', title: 'ChatApp Link', icon: 'message', onClick: () => openApp('chatapp', 'Secure ChatApp', 'message') },
              { id: 'settings', title: 'Settings OS', icon: 'settings', onClick: () => openApp('settings', 'Settings Application', 'settings') },
              { id: 'security', title: 'Security Core', icon: 'security', onClick: () => openApp('security', 'Security Compliance', 'security') },
              { id: 'optimisme', title: 'Optimisme Suite', icon: 'sun', onClick: () => openApp('optimisme', 'Optimisme Suite', 'sun') },
              { id: 'camera', title: 'Core Camera', icon: 'camera', onClick: () => openApp('camera', 'Core Camera', 'camera') },
              { id: 'store', title: 'App Store', icon: 'store', onClick: () => openApp('store', 'Blackhole Store', 'store') },
            ].filter(shortcut => installedAppIds.includes(shortcut.id)).map((shortcut) => {
              const pos = shortcutPositions[shortcut.id] || { x: 25, y: 30 };
              const isDragging = draggingShortcutId === shortcut.id;

              const renderShortcutIcon = () => {
                switch(shortcut.icon) {
                  case 'star': return <Star className="w-6 h-6 text-amber-400 group-hover:scale-105 transition-transform" />;
                  case 'folder': return <Folder className="w-6 h-6 text-amber-500 group-hover:scale-105 transition-transform" />;
                  case 'globe': return <Globe className="w-6 h-6 text-blue-400 group-hover:scale-105 transition-transform" />;
                  case 'message': return <MessageSquare className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform" />;
                  case 'settings': return <Settings className={`w-6 h-6 text-indigo-400 group-hover:scale-105 transition-transform ${settings.disableAnimations ? '' : 'animate-hover-spin'}`} />;
                  case 'security': return <ShieldCheck className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform" />;
                  case 'sun': return <Sun className={`w-6 h-6 text-amber-500 group-hover:scale-105 transition-transform ${settings.disableAnimations ? '' : 'animate-spin-slow'}`} />;
                  case 'camera': return <Camera className="w-6 h-6 text-emerald-400 group-hover:scale-105 transition-transform" />;
                  case 'store': return <ShoppingBag className="w-6 h-6 text-indigo-400 group-hover:scale-105 transition-transform" />;
                  default: return <Folder className="w-6 h-6 text-blue-400" />;
                }
              };

              return (
                <div
                  key={shortcut.id}
                  style={{
                    position: 'absolute',
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                  }}
                  onMouseDown={(e) => {
                    if (e.button !== 0) return;
                    setDraggingShortcutId(shortcut.id);
                    dragShortcutOffset.current = {
                      x: e.clientX - pos.x,
                      y: e.clientY - pos.y
                    };
                    e.stopPropagation();
                  }}
                  onDoubleClick={shortcut.onClick}
                  className={`group flex flex-col items-center justify-center text-center p-1 rounded-xl border pointer-events-auto select-none w-[80px] h-[95px] cursor-pointer ${
                    isDragging
                      ? 'border-blue-500/80 bg-blue-500/10 z-30 scale-102 shadow-lg shadow-black/40'
                      : 'border-transparent hover:bg-slate-900/20 hover:border-slate-850/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-900/40 border border-slate-800/60 group-hover:border-slate-700 flex items-center justify-center shadow transition-all duration-200">
                    {renderShortcutIcon()}
                  </div>
                  <span className="text-[10.5px] font-medium text-slate-200 mt-1.5 truncate w-full px-1 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight">
                    {shortcut.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Dynamic Island Notch */}
          <DynamicIsland 
            activePermissions={activePermissions} 
            onToggleSimulatedPermission={(type, appName) => {
              setActivePermissions(prev => ({
                ...prev,
                [type]: {
                  active: !prev[type].active,
                  appName: !prev[type].active ? appName : ''
                }
              }));
            }}
          />

          {/* Task Switcher (Recent Apps Overlay) */}
          {taskSwitcherOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-6 select-none cursor-pointer"
              onClick={() => setTaskSwitcherOpen(false)}
            >
              <motion.div 
                initial={{ scale: 0.92, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                className="w-full max-w-4xl flex flex-col space-y-6 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-900/60 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold tracking-widest">
                      <AppWindow className="w-4 h-4 animate-pulse" />
                      <span>RECENT APPLICATIONS (ONEUI SPACE)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-sans">
                      Klik tombol "Hentikan" untuk menutup app atau "Buka App" untuk kembali. Tap kartu untuk fokus.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {windows.filter(w => w.isOpen).length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setWindows([]);
                          setFocusedWindowId(null);
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/20 text-[10px] font-bold font-mono rounded-xl transition-all duration-200 cursor-pointer uppercase tracking-wider shadow-lg shadow-red-950/20"
                        title="Clear all open applications"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hentikan Semua (Clear All)</span>
                      </button>
                    )}
                    <span className="text-[10px] font-mono text-slate-600 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-900">
                      Press [Space] x2 on Desktop to Toggle
                    </span>
                  </div>
                </div>

                {/* Horizontal App Spaces Stack */}
                <div className="flex items-center gap-5 overflow-x-auto py-6 px-1 w-full justify-start md:justify-center max-w-full scrollbar-thin scrollbar-track-transparent min-h-[340px]">
                  <AnimatePresence mode="popLayout">
                    {windows.filter(w => w.isOpen).length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full text-center py-20 text-slate-500 font-mono text-xs border border-dashed border-slate-900 rounded-2xl bg-slate-950/40"
                      >
                        No active workspace processes found.
                      </motion.div>
                    ) : (
                      windows.filter(w => w.isOpen).map((win) => {
                        return (
                          <motion.div
                            key={win.id}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -60, transition: { duration: 0.2 } }}
                            whileHover={{ scale: 1.04, y: -6, boxShadow: "0 20px 30px -10px rgba(59, 130, 246, 0.2)" }}
                            className="relative flex flex-col w-56 h-72 bg-[#060a13]/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden cursor-pointer shrink-0 transition-all duration-300 hover:border-slate-700"
                            onClick={() => {
                              // Restore and focus
                              setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMinimized: false } : w));
                              setFocusedWindowId(win.id);
                              setTaskSwitcherOpen(false);
                            }}
                          >
                            {/* Top Bar inside Card */}
                            <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-850">
                              <div className="flex items-center gap-1.5 text-slate-300 font-mono text-[10.5px]">
                                {renderAppIcon(win.appId, "w-3.5 h-3.5")}
                                <span className="font-bold truncate max-w-[110px]">{win.title}</span>
                              </div>
                              {/* Close / Terminate */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeWindow(win.id);
                                }}
                                className="p-1 rounded hover:bg-red-500/10 hover:text-red-400 text-slate-500 transition-colors cursor-pointer"
                                title="Force Quit App"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Snapshot Mock Content */}
                            <div className="flex-1 p-4 bg-gradient-to-b from-[#010204] to-slate-950/90 flex flex-col justify-between relative">
                              {/* App Icon centered circle */}
                              <div className="w-16 h-16 rounded-2xl bg-[#090e1a]/80 border border-slate-850 flex items-center justify-center self-center shadow-inner mt-4">
                                {renderAppIcon(win.appId, "w-8 h-8")}
                              </div>

                              <div className="space-y-1.5 text-center mt-2">
                                <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">PID: {win.id.substring(0, 6)}</span>
                                <div className="flex items-center justify-center gap-1.5">
                                  <span className={`w-1.5 h-1.5 rounded-full ${win.isMinimized ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse-slow'}`} />
                                  <span className="text-[9px] font-mono font-bold text-slate-400">
                                    {win.isMinimized ? 'SUSPENDED' : 'RUNNING'}
                                  </span>
                                </div>
                              </div>

                              {/* Interactive Dual Actions Area */}
                              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-900/60 w-full shrink-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Restore and focus
                                    setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMinimized: false } : w));
                                    setFocusedWindowId(win.id);
                                    setTaskSwitcherOpen(false);
                                  }}
                                  className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold rounded-lg transition-all duration-200 uppercase tracking-wider cursor-pointer text-center"
                                >
                                  Buka App
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    closeWindow(win.id);
                                  }}
                                  className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 font-mono text-[9px] font-bold rounded-lg transition-all duration-200 uppercase tracking-wider cursor-pointer text-center flex items-center justify-center gap-1"
                                >
                                  <Trash2 className="w-2.5 h-2.5" />
                                  Hentikan
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Desktop Windows Stack */}
          <div className="absolute inset-0 w-full h-full pb-12 pointer-events-none z-20">
            {windows.map((win) => {
              const isActive = focusedWindowId === win.id;

              return (
                <Window
                  key={win.id}
                  window={win}
                  active={isActive}
                  accentColor={settings.accentColor}
                  onFocus={() => focusWindow(win.id)}
                  onClose={() => closeWindow(win.id)}
                  onMinimize={() => minimizeWindow(win.id)}
                  onMaximize={() => maximizeWindow(win.id)}
                  onUpdatePosition={(x, y, w, h) => updateWindowPosition(win.id, x, y, w, h)}
                  themeStyle={settings.themeStyle}
                  disableAnimations={settings.disableAnimations}
                  onHeaderEnter={() => setIsBackgroundPaused(true)}
                  onHeaderLeave={() => setIsBackgroundPaused(false)}
                  onWindowEnter={() => setIsHoveringWindow(true)}
                  onWindowLeave={() => setIsHoveringWindow(false)}
                >
                  {/* Select corresponding App to mount inside window */}
                  {win.appId === 'welcome' && (
                    <WelcomeApp 
                      accentColor={settings.accentColor} 
                      onOpenApp={(id) => {
                        if (id === 'settings') openApp('settings', 'Settings Application', 'settings');
                      }} 
                    />
                  )}
                  {win.appId === 'browser' && <BrowserApp />}
                  {win.appId === 'chatapp' && <ChatAppLauncher />}
                  {win.appId === 'files' && (
                    <FileExplorer 
                      fileSystem={fileSystem} 
                      onUpdateFileSystem={setFileSystem} 
                    />
                  )}
                  {win.appId === 'settings' && (
                    <SettingsApp
                      settings={settings}
                      session={session}
                      onUpdateSettings={setSettings}
                      onUpdateSession={setSession}
                    />
                  )}
                  {win.appId === 'security' && (
                    <SecurityHub
                      onClearSession={handleClearSession}
                      onLockSystem={handleLogout}
                    />
                  )}
                  {win.appId === 'optimisme' && (
                    <OptimismeApp accentColor={settings.accentColor} />
                  )}
                  {win.appId === 'camera' && (
                    <CameraApp 
                      fileSystem={fileSystem} 
                      onUpdateFileSystem={setFileSystem} 
                      onSetCameraActive={(active, appName) => {
                        setActivePermissions(prev => ({
                          ...prev,
                          camera: { active, appName: active ? appName : '' }
                        }));
                      }}
                    />
                  )}
                  {win.appId === 'store' && (
                    <StoreApp 
                      installedAppIds={installedAppIds} 
                      onInstallApp={(id) => {
                        setInstalledAppIds(prev => prev.includes(id) ? prev : [...prev, id]);
                        // Auto-create shortcut
                        openApp(id as any, id.toUpperCase(), 'star');
                      }}
                      onUninstallApp={(id) => setInstalledAppIds(prev => prev.filter(x => x !== id))}
                    />
                  )}
                </Window>
              );
            })}
          </div>

          {/* 4. SECURITY SYSTEM OVERLAY LOCK (When locked state occurs) */}
          <AnimatePresence>
            {systemState === 'locked' && (
              <motion.div
                key="lockscreen-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="absolute inset-0 z-[999] flex flex-col md:flex-row select-none overflow-hidden"
              >
                {/* Dynamically cross-fading lockscreen background */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lockscreenWallpaperIdx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.5 }}
                      style={{
                        background: INITIAL_WALLPAPERS[lockscreenWallpaperIdx].type === 'canvas' 
                          ? undefined 
                          : (INITIAL_WALLPAPERS[lockscreenWallpaperIdx].type as string) === 'image'
                            ? `url("${INITIAL_WALLPAPERS[lockscreenWallpaperIdx].value}") no-repeat center center / cover`
                            : INITIAL_WALLPAPERS[lockscreenWallpaperIdx].value,
                      }}
                      className="absolute inset-0 bg-grid"
                    >
                      {INITIAL_WALLPAPERS[lockscreenWallpaperIdx].type === 'canvas' && (
                        <BlackholeBackground mode="login" accentColor={settings.accentColor} />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                </div>

                {/* Left Side: Real-time clock and date */}
                <div className="flex-1 flex flex-col justify-end p-12 md:p-20 text-left space-y-4 z-10">
                  <div className="space-y-1">
                    <motion.div 
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="text-6xl md:text-8xl font-black font-sans tracking-tighter text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
                    >
                      {systemTrayClock.split(' ')[0]}
                    </motion.div>
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-sm md:text-lg text-emerald-400 font-mono font-medium uppercase tracking-widest pl-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                    >
                      {(() => {
                        const d = new Date();
                        const isIndonesian = (localStorage.getItem('blackhole_user_country') || 'Indonesia') === 'Indonesia';
                        const weekdayStr = d.toLocaleDateString(isIndonesian ? 'id-ID' : 'en-US', { weekday: 'long' });
                        const dateStr = d.toLocaleDateString(isIndonesian ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                        return `${weekdayStr}, ${dateStr}`;
                      })()}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 0.6 }}
                    className="text-[10px] font-mono text-slate-500 uppercase tracking-wider pl-1"
                  >
                    BlackholeOS Sub-system Node Secure Lock | Country: {localStorage.getItem('blackhole_user_country') || 'Indonesia'}
                  </motion.div>
                </div>

                {/* Right Side: Password lock entry */}
                <div className="w-full md:w-[450px] flex flex-col justify-center p-8 md:p-16 shrink-0 z-10 bg-slate-950/35 border-l border-slate-900/40 backdrop-blur-2xl relative">
                  
                  {/* Emergency exit trigger positioned beautifully inside the lock panel */}
                  <div className="absolute top-6 right-6">
                    <button
                      onClick={() => setEmergencyPurgeOpen(true)}
                      className="p-2 rounded-xl bg-red-600/10 hover:bg-red-600 hover:text-white border border-red-500/20 text-red-400 transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                      title="Emergency Exit (Reset Account)"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Emergency Exit</span>
                    </button>
                  </div>

                  <div className="space-y-6 w-full max-w-sm mx-auto">
                    <div className="space-y-2 text-center md:text-left">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-950 to-blue-900 border border-slate-800 flex items-center justify-center font-bold text-white text-xl mx-auto md:mx-0 shadow-lg shadow-blue-950/20">
                        {(session?.username || 'Guest').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white font-display">Selamat Datang Kembali</h3>
                        <p className="text-xs text-slate-400">Masukkan kata sandi enkripsi Anda untuk memverifikasi sesi node_guest@{session?.username || 'Guest'}.</p>
                      </div>
                    </div>

                    <form onSubmit={handleLockscreenUnlock} className="space-y-4">
                      {lockscreenError && (
                        <div className="p-3 bg-red-950/45 border border-red-500/20 rounded-xl text-xs text-red-400 font-mono flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{lockscreenError}</span>
                        </div>
                      )}

                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Access Cyphercode (Password)
                        </label>
                        <div className="bg-slate-950/80 border border-slate-850 focus-within:border-emerald-500/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2 transition-all">
                          <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                          <input
                            type="password"
                            value={lockscreenPassword}
                            onChange={(e) => setLockscreenPassword(e.target.value)}
                            placeholder="••••••••••••"
                            className="bg-transparent text-xs text-slate-200 outline-none w-full font-mono placeholder-slate-700"
                            disabled={isUnlocking}
                            autoFocus
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isUnlocking}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs tracking-wider uppercase shadow-lg shadow-emerald-950/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {isUnlocking ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-white" />
                            <span>Unsealing workspace...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Unlock Desktop</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMERGENCY PURGE CONFIRMATION MODAL POP-UP */}
          <AnimatePresence>
            {emergencyPurgeOpen && (
              <motion.div
                key="emergency-purge-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/90 backdrop-blur-md z-[1000] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="w-full max-w-md bg-slate-950 border-2 border-red-600/35 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden font-sans text-center space-y-6"
                >
                  <div className="absolute w-[200px] h-[200px] rounded-full bg-radial from-red-600/10 via-transparent to-transparent pointer-events-none filter blur-xl -top-20 -left-20" />

                  <div className="w-14 h-14 bg-red-600/15 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-500 animate-pulse">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">🚨 KELUAR & HAPUS AKUN SECURE</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Apakah Anda yakin ingin keluar? Menekan <strong className="text-red-400 font-bold">OK</strong> akan menghapus akun beserta seluruh data konfigurasi, shortcuts, dan dokumen aman di dalam virtual storage S: secara permanen dari browser ini.
                    </p>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-2xl text-[10.5px] font-mono text-slate-500 space-y-1">
                    <div className="flex justify-between">
                      <span>S: FILE SYSTEM:</span>
                      <span className="text-red-400 font-bold">WILL BE PURGED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CREDENTIAL CACHE:</span>
                      <span className="text-red-400 font-bold">WILL BE WIPED</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setEmergencyPurgeOpen(false)}
                      className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Tidak (Batal)
                    </button>
                    <button
                      onClick={handleClearSession}
                      className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Ya, OK</span>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SHUTDOWN / LOCK CONFIRMATION OVERLAY */}
          <AnimatePresence>
            {shutdownPopupOpen && (
              <motion.div
                key="shutdown-confirm-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  className="w-full max-w-sm bg-slate-950/90 border border-slate-850/80 rounded-2xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden font-sans text-center space-y-5"
                >
                  <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/25 rounded-full flex items-center justify-center mx-auto text-amber-500 animate-pulse">
                    <Power className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Kunci / Matikan Sub-system</h3>
                    <p className="text-xs text-slate-400">Apakah Anda ingin mengunci layar (Lock Screen) demi keamanan?</p>
                  </div>

                  <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl text-[10px] font-mono text-slate-500 flex flex-col gap-0.5">
                    <div>Pencet [ Enter ] untuk mengunci</div>
                    <div>Pencet [ Esc ] untuk membatalkan</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setShutdownPopupOpen(false)}
                      className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-850 text-slate-300 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Batal (Esc)
                    </button>
                    <button
                      onClick={() => {
                        setSystemState('locked');
                        setShutdownPopupOpen(false);
                      }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950/20"
                    >
                      <span>Kunci (Enter)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. QUICK PANEL (Tray Overlay controls) */}
          <AnimatePresence>
            {quickPanelOpen && (
              <motion.div
                key="quick-panel"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute bottom-18 right-2 w-72 bg-slate-950/95 border border-slate-850/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl z-40 select-none flex flex-col gap-4 font-sans text-xs"
              >
                <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                  <span className="font-semibold text-white">Quick Settings Panel</span>
                  <span className="text-[10px] text-slate-500 font-mono">IBT-Core-7</span>
                </div>

                {/* Toggles grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 flex flex-col gap-1.5">
                    <span className="text-slate-500 text-[10px] uppercase">WIFI ADAPTER</span>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5" /> Enabled
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-850 flex flex-col gap-1.5">
                    <span className="text-slate-500 text-[10px] uppercase">SOUND CHANNELS</span>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-400 font-medium flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" /> Stereo
                      </span>
                    </div>
                  </div>
                </div>

                {/* System diagnostics quick stats */}
                <div className="space-y-2">
                  <div className="flex justify-between font-mono text-[10px] text-slate-500">
                    <span>SANDBOX ISOLATION:</span>
                    <span className="text-emerald-400">ACTIVE [SECURE]</span>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-slate-500">
                    <span>RAM FOOTPRINT:</span>
                    <span className="text-slate-300">LOW (2GB Opt)</span>
                  </div>
                </div>

                <div className="h-px bg-slate-900" />

                {/* Lock screen button */}
                <button
                  onClick={() => {
                    setQuickPanelOpen(false);
                    setSystemState('locked');
                  }}
                  className="w-full py-2.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 font-semibold rounded-xl text-[11px] hover:bg-blue-600 hover:text-white transition-all cursor-pointer text-center"
                >
                  Lock OS Desktop Workspace
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6. START MENU PANEL */}
          <AnimatePresence>
            {startMenuOpen && (
              <motion.div
                key="start-menu"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute bottom-18 left-2 w-96 h-[440px] bg-slate-950/95 border border-slate-850/90 rounded-2xl shadow-2xl backdrop-blur-xl z-40 select-none flex overflow-hidden font-sans"
              >
              
              {/* Left Column: Profile & quick actions */}
              <div className="w-16 bg-slate-900/60 border-r border-slate-900 flex flex-col items-center py-4 gap-4 justify-between shrink-0">
                {/* Safe top position for power/logout buttons to prevent accidental click-throughs */}
                <div className="flex flex-col items-center gap-3 text-slate-500 hover:text-slate-300">
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-slate-800/80 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Logout Account"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                  </button>
                  <button 
                    onClick={handleShutdown}
                    className="p-2 rounded-lg hover:bg-slate-800/80 hover:text-slate-200 transition-colors cursor-pointer"
                    title="Shutdown (Reboot OS)"
                  >
                    <Power className="w-4 h-4 text-amber-500" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-4">
                  {/* Small profile icon at the safe bottom */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-950 to-blue-900 border border-slate-800 flex items-center justify-center font-bold text-white text-xs">
                    {session.username.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Main menu content */}
              <div className="flex-1 p-4.5 flex flex-col gap-4 min-w-0">
                
                {/* Search Bar in Start */}
                <div className="flex items-center bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs">
                  <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search systems & manuals..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="bg-transparent outline-none w-full text-slate-300 placeholder-slate-600 text-xs"
                    autoFocus
                  />
                </div>

                <div className="flex-1 overflow-y-auto min-h-0">
                  {searchText.trim() ? (
                    // Search results view
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Search Results
                      </span>
                      {searchResults.length === 0 ? (
                        <div className="text-xs text-slate-600 text-center py-8">
                          No resources found matching "{searchText}"
                        </div>
                      ) : (
                        searchResults.map((app) => (
                          <div
                            key={app.id}
                            onClick={() => openApp(app.id, app.title, app.icon)}
                            className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/30 hover:bg-slate-900 border border-transparent hover:border-slate-850/60 cursor-pointer transition-colors"
                          >
                            <div className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg">
                              {renderAppIcon(app.id, "w-4 h-4")}
                            </div>
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-white block">{app.title}</span>
                              <span className="text-[10px] text-slate-500 block truncate">{app.desc}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  ) : (
                    // Standard start list
                    <div className="space-y-4">
                      {/* Pinned Core Applications */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                          Pinned Applications
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          {allApps.map((app) => (
                            <div
                              key={app.id}
                              onClick={() => openApp(app.id, app.title, app.icon)}
                              className="flex flex-col items-center text-center p-2 rounded-xl bg-slate-900/20 hover:bg-slate-900 border border-transparent hover:border-slate-850/60 cursor-pointer transition-all duration-150"
                            >
                              <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-850 mb-1.5 group-hover:scale-105 transition-transform">
                                {renderAppIcon(app.id, "w-4.5 h-4.5")}
                              </div>
                              <span className="text-[9.5px] font-medium text-slate-300 truncate w-full px-0.5 leading-tight">
                                {app.title.split(' ')[0]}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Folder paths links */}
                      <div className="border-t border-slate-900/80 pt-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5 px-1">
                          Virtual Shortcuts
                        </span>
                        <div className="space-y-1">
                          <button
                            onClick={() => openApp('files', 'File Manager', 'folder')}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-900 hover:text-white text-left transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Folder className="w-3.5 h-3.5 text-blue-500/80" /> Documents Folder
                            </span>
                            <span className="text-[9px] text-slate-600 font-mono">/home/documents</span>
                          </button>
                          <button
                            onClick={() => openApp('files', 'File Manager', 'folder')}
                            className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-900 hover:text-white text-left transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              <Folder className="w-3.5 h-3.5 text-blue-500/80" /> Downloads Folder
                            </span>
                            <span className="text-[9px] text-slate-600 font-mono">/home/downloads</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile row */}
                <div className="bg-slate-900/30 border border-slate-900/80 rounded-xl p-2.5 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-slate-300 font-mono truncate">node_guest@{session.username}</span>
                  </div>
                  <span className="text-[9px] bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">
                    ONLINE
                  </span>
                </div>

              </div>
            </motion.div>
          )}
          </AnimatePresence>

          {/* 7. SYSTEM TASKBAR (Mac OS style unified floating rounded bar) */}
          <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 h-14 rounded-2xl border shadow-2xl backdrop-blur-xl z-50 flex items-center gap-4 px-4.5 select-none transition-all duration-300 ${
            settings.themeStyle === 'retro-terminal'
              ? 'bg-black border-2 border-emerald-500/80 text-emerald-400 font-mono'
              : settings.themeStyle === 'solid'
                ? 'bg-[#090e1a] border-slate-850'
                : 'bg-slate-950/85 border-slate-850/80'
          }`}>
            
            {/* Start Button / OS Brand */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setStartMenuOpen(!startMenuOpen);
                  setQuickPanelOpen(false);
                }}
                className={`h-9 w-9 rounded-xl flex items-center justify-center border transition-all duration-200 cursor-pointer ${
                  startMenuOpen
                    ? settings.accentColor === 'green' ? 'border-emerald-500 bg-emerald-500/10' : settings.accentColor === 'white' ? 'border-slate-300 bg-slate-300/10' : 'border-blue-500 bg-blue-500/10'
                    : 'border-slate-850 hover:bg-slate-900 hover:border-slate-700/80 bg-slate-950'
                }`}
                title="Start Menu"
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <div className={`absolute inset-0 rounded-full border border-dashed ${settings.disableAnimations ? '' : 'animate-spin duration-3000'} ${
                    settings.accentColor === 'green' ? 'border-emerald-400' : settings.accentColor === 'white' ? 'border-slate-300' : 'border-blue-500'
                  }`} />
                  <span className="font-display font-black text-white text-[11px] tracking-widest">
                    O
                  </span>
                </div>
              </button>
            </div>

            <div className="h-5 w-px bg-slate-800/80 shrink-0" />

            {/* App Icons (Mac dock style: icon only!) */}
            <div className="flex items-center gap-2 overflow-x-auto max-w-[300px] sm:max-w-md md:max-w-lg scrollbar-none">
              {allApps.map((app) => {
                const activeWin = windows.find(w => w.appId === app.id);
                const isOpen = !!activeWin;
                const isFocused = isOpen && focusedWindowId === activeWin.id;

                return (
                  <button
                    key={app.id}
                    onClick={() => {
                      if (isOpen) {
                        if (isFocused) {
                          minimizeWindow(activeWin.id);
                        } else {
                          focusWindow(activeWin.id);
                        }
                      } else {
                        openApp(app.id, app.title, app.icon);
                      }
                    }}
                    className={`h-9.5 w-9.5 rounded-xl border relative transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                      isFocused
                        ? 'border-slate-750 bg-slate-900 text-white shadow-inner scale-105'
                        : isOpen
                          ? 'border-slate-850 bg-slate-950/40 text-slate-300'
                          : 'border-transparent bg-transparent hover:bg-slate-900/30 text-slate-500'
                    }`}
                    title={`${app.title} (${isOpen ? 'Active' : 'Click to Open'})`}
                  >
                    {renderAppIcon(app.id, "w-4.5 h-4.5")}
                    
                    {/* Active indicator dot underneath the button */}
                    {isOpen && (
                      <span className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        isFocused 
                          ? settings.accentColor === 'green' ? 'bg-emerald-400' : settings.accentColor === 'white' ? 'bg-slate-100' : 'bg-blue-400'
                          : 'bg-slate-600'
                      }`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="h-5 w-px bg-slate-800/80 shrink-0" />

            {/* Right System Tray Info & Clock */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Performance Indicator small diagnostic pill */}
              <div 
                onClick={() => openApp('settings', 'Settings Application', 'settings')}
                className="hidden lg:flex items-center gap-1.5 bg-slate-900/40 border border-slate-850/80 px-2.5 py-1 rounded-lg text-[9px] font-mono hover:bg-slate-900 cursor-pointer text-slate-400"
                title="RAM Load Optimizations active (2GB Budget)"
              >
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>MEM: 5.4%</span>
              </div>

              {/* Status tray widgets trigger */}
              <div 
                onClick={() => {
                  setQuickPanelOpen(!quickPanelOpen);
                  setStartMenuOpen(false);
                }}
                className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border cursor-pointer transition-all ${
                  quickPanelOpen 
                    ? 'bg-blue-600/10 border-blue-500/40 text-white' 
                    : 'border-transparent hover:bg-slate-900 text-slate-400'
                }`}
                title="Status Tray & Settings"
              >
                <Wifi className="w-3.5 h-3.5 text-emerald-400 animate-pulse-slow" />
                <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                <Battery className="w-3.5 h-3.5 text-blue-400" />
                <ChevronUp className={`w-3 h-3 transition-transform duration-200 ${quickPanelOpen ? 'rotate-180' : ''}`} />
              </div>

              <div className="h-4 w-px bg-slate-800/80" />

              {/* Real-time Clock */}
              <div 
                className="flex items-center gap-1 text-slate-300 cursor-pointer font-mono text-[10px]"
                title={`${systemTrayDate} - BlackholeOS Local Time`}
                onClick={() => {
                  setQuickPanelOpen(!quickPanelOpen);
                  setStartMenuOpen(false);
                }}
              >
                <Clock className="w-3 h-3 text-slate-400 mr-0.5" />
                <span className="font-bold tracking-wide leading-none">{systemTrayClock.split(' ')[0]}</span>
              </div>
            </div>

          </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
