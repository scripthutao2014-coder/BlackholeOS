import React, { useState, useEffect } from 'react';
import { 
  Camera, Mic, Monitor, Clock, Cpu, HardDrive, 
  ChevronDown, ChevronUp, AlertCircle, Sparkles, Volume2, Wifi 
} from 'lucide-react';

interface PermissionState {
  active: boolean;
  appName: string;
}

interface DynamicIslandProps {
  activePermissions: {
    camera: PermissionState;
    microphone: PermissionState;
    screenRecording: PermissionState;
  };
  onToggleSimulatedPermission: (type: 'microphone' | 'screenRecording', appName: string) => void;
}

export default function DynamicIsland({ activePermissions, onToggleSimulatedPermission }: DynamicIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [cpuUsage, setCpuUsage] = useState(12);
  const [memUsage, setMemUsage] = useState(45);

  // Update time for the compact display
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate floating system stats to keep the Island feeling "alive"
  useEffect(() => {
    const statInterval = setInterval(() => {
      setCpuUsage(prev => {
        const delta = Math.floor(Math.random() * 11) - 5; // -5 to +5
        return Math.max(5, Math.min(85, prev + delta));
      });
      setMemUsage(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(30, Math.min(95, prev + delta));
      });
    }, 3000);
    return () => clearInterval(statInterval);
  }, []);

  const hasActiveIndicator = 
    activePermissions.camera.active || 
    activePermissions.microphone.active || 
    activePermissions.screenRecording.active;

  return (
    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 select-none">
      {/* Notch / Pill Body */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-black text-white border shadow-[0_4px_30px_rgba(0,0,0,0.8)] flex items-center justify-between transition-all duration-300 ease-out cursor-pointer hover:scale-102 ${
          isExpanded 
            ? 'w-80 rounded-[28px] p-4 border-slate-800' 
            : hasActiveIndicator
              ? 'w-48 h-8 px-3.5 rounded-full border-emerald-500/30'
              : 'w-32 h-8 px-4 rounded-full border-slate-900'
        }`}
      >
        {!isExpanded ? (
          /* Compact View */
          <div className="flex items-center justify-between w-full h-full font-mono text-[10.5px]">
            {/* Clock */}
            <span className="text-slate-400 font-semibold tracking-tight">{timeStr}</span>

            {/* Simulating lens dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 mx-1 border border-slate-800/60 shrink-0" />

            {/* Privacy indicators group */}
            <div className="flex items-center gap-1.5">
              {activePermissions.camera.active && (
                <div 
                  className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-400/30" 
                  title={`Camera used by ${activePermissions.camera.appName}`}
                />
              )}
              {activePermissions.microphone.active && (
                <div 
                  className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border border-red-400/30" 
                  title={`Microphone used by ${activePermissions.microphone.appName}`}
                />
              )}
              {activePermissions.screenRecording.active && (
                <div 
                  className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse border border-amber-300/30" 
                  title={`Screen Recording active via ${activePermissions.screenRecording.appName}`}
                />
              )}

              {/* General active state if no permissions active */}
              {!hasActiveIndicator && (
                <div className="w-2 h-2 rounded-full bg-blue-500/40" />
              )}
            </div>
          </div>
        ) : (
          /* Expanded Bento Layout */
          <div className="flex flex-col w-full space-y-3.5" onClick={(e) => e.stopPropagation()}>
            {/* Top header row */}
            <div className="flex justify-between items-center pb-2 border-b border-slate-900 select-none">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px] font-mono font-black text-slate-300">SYSTEM HUB</span>
              </div>
              <button 
                onClick={() => setIsExpanded(false)} 
                className="p-1 hover:bg-slate-900 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Privacy indicators details pane */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pb-0.5 uppercase tracking-wider">
                <span>Privacy & Permissions</span>
                <span className="text-slate-600">Click to test toggles</span>
              </div>

              {/* Camera Indicator Info */}
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-950/80 border border-slate-900/60">
                <div className="flex items-center gap-2">
                  <Camera className={`w-3.5 h-3.5 ${activePermissions.camera.active ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span className="text-xs text-slate-300 font-mono">Camera</span>
                </div>
                {activePermissions.camera.active ? (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-900/30">
                    USED BY: {activePermissions.camera.appName.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-600 uppercase">INACTIVE</span>
                )}
              </div>

              {/* Microphone Indicator Info / Toggle */}
              <button
                onClick={() => onToggleSimulatedPermission('microphone', 'ChatApp Link')}
                className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-950/80 border border-slate-900/60 hover:bg-slate-900/40 hover:border-slate-800 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Mic className={`w-3.5 h-3.5 ${activePermissions.microphone.active ? 'text-red-400' : 'text-slate-500'}`} />
                  <span className="text-xs text-slate-300 font-mono">Microphone</span>
                </div>
                {activePermissions.microphone.active ? (
                  <span className="text-[10px] font-mono text-red-400 font-bold bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/30">
                    USED BY: {activePermissions.microphone.appName.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-600 uppercase">OFF (TAP TO TEST)</span>
                )}
              </button>

              {/* Screen Recording Info / Toggle */}
              <button
                onClick={() => onToggleSimulatedPermission('screenRecording', 'Optimisme Suite')}
                className="w-full flex items-center justify-between p-1.5 rounded-lg bg-slate-950/80 border border-slate-900/60 hover:bg-slate-900/40 hover:border-slate-800 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2">
                  <Monitor className={`w-3.5 h-3.5 ${activePermissions.screenRecording.active ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span className="text-xs text-slate-300 font-mono">Screen Recorder</span>
                </div>
                {activePermissions.screenRecording.active ? (
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-900/30">
                    USED BY: {activePermissions.screenRecording.appName.toUpperCase()}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-600 uppercase">OFF (TAP TO TEST)</span>
                )}
              </button>
            </div>

            {/* Diagnostics Stats */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-xs font-mono">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-blue-400" /> CPU</span>
                  <span>{cpuUsage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                  <div className="bg-blue-400 h-full transition-all duration-500" style={{ width: `${cpuUsage}%` }} />
                </div>
              </div>

              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><HardDrive className="w-3 h-3 text-emerald-400" /> MEM</span>
                  <span>{memUsage}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1 overflow-hidden">
                  <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${memUsage}%` }} />
                </div>
              </div>
            </div>
            
            {/* Collapse instruction footer */}
            <div className="text-[8.5px] font-mono text-slate-600 text-center select-none pt-1">
              TAP BLACKHOLE NOTCH TO COLLAPSE
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
