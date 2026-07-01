import React, { useState, useRef, useEffect } from 'react';
import { WindowInstance, AccentColor } from '../types';
import { Minus, Square, Copy, X } from 'lucide-react';
import { motion } from 'motion/react';

interface WindowProps {
  key?: string | number;
  window: WindowInstance;
  active: boolean;
  accentColor: AccentColor;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
  themeStyle?: 'glass' | 'solid' | 'retro-terminal';
  disableAnimations?: boolean;
  onHeaderEnter?: () => void;
  onHeaderLeave?: () => void;
  onWindowEnter?: () => void;
  onWindowLeave?: () => void;
}

export default function Window({
  window: win,
  active,
  accentColor,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  children,
  themeStyle = 'glass',
  disableAnimations = false,
  onHeaderEnter,
  onHeaderLeave,
  onWindowEnter,
  onWindowLeave,
}: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<false | 'both' | 'right' | 'bottom'>(false);
  
  // Refs to track drag/resize metrics without triggering excessive React renders
  const dragStart = useRef({ x: 0, y: 0 });
  const windowStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const getBorderColorClass = () => {
    if (themeStyle === 'retro-terminal') {
      return active 
        ? 'border-2 border-emerald-500 bg-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
        : 'border-2 border-slate-800 bg-black';
    }
    if (themeStyle === 'solid') {
      return active 
        ? 'border-slate-750 bg-[#0b0e1a] shadow-2xl shadow-black/80' 
        : 'border-slate-850/80 bg-[#060810]';
    }
    // Default: Glassmorphic theme
    if (!active) return 'border-slate-850 bg-slate-950/95';
    if (accentColor === 'green') return 'border-emerald-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.7)] border-glow-green';
    if (accentColor === 'white') return 'border-slate-400/40 shadow-[0_20px_40px_rgba(0,0,0,0.7)]';
    return 'border-blue-500/40 shadow-[0_20px_40px_rgba(0,0,0,0.7)] border-glow-blue';
  };

  const getHeaderBgClass = () => {
    if (themeStyle === 'retro-terminal') {
      return active 
        ? 'bg-emerald-950/50 text-emerald-400 border-b border-emerald-500/80 font-mono' 
        : 'bg-slate-950 text-slate-500 border-b border-slate-850 font-mono';
    }
    if (themeStyle === 'solid') {
      return active 
        ? 'bg-[#101529] text-white border-b border-slate-800' 
        : 'bg-[#0a0d1b] text-slate-400 border-b border-slate-850';
    }
    // Default: Glassmorphic theme
    if (!active) return 'bg-slate-900/95 text-slate-400 border-b border-slate-850/60';
    if (accentColor === 'green') return 'bg-emerald-950/20 text-white border-b border-emerald-900/30';
    if (accentColor === 'white') return 'bg-slate-900 text-white border-b border-slate-850';
    return 'bg-blue-950/20 text-white border-b border-blue-900/30';
  };

  // Drag Handlers
  const handleDragStart = (e: React.MouseEvent) => {
    // Prevent dragging if clicking window control buttons
    if ((e.target as HTMLElement).closest('.win-btn')) return;
    
    onFocus();
    if (win.isMaximized) return;

    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    windowStart.current = { x: win.x, y: win.y, w: win.width, h: win.height };
    e.preventDefault();
  };

  // Resize Handlers
  const handleResizeStart = (e: React.MouseEvent, type: 'both' | 'right' | 'bottom') => {
    onFocus();
    if (win.isMaximized) return;

    setIsResizing(type);
    dragStart.current = { x: e.clientX, y: e.clientY };
    windowStart.current = { x: win.x, y: win.y, w: win.width, h: win.height };
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        // Boundaries checks to prevent dragging window entirely out of screen
        const nextX = Math.max(-win.width + 100, Math.min(window.innerWidth - 100, windowStart.current.x + dx));
        const nextY = Math.max(0, Math.min(window.innerHeight - 80, windowStart.current.y + dy));

        onUpdatePosition(nextX, nextY, win.width, win.height);
      }

      if (isResizing) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        
        let nextW = win.width;
        let nextH = win.height;

        if (isResizing === 'both' || isResizing === 'right') {
          nextW = Math.max(320, windowStart.current.w + dx);
        }
        if (isResizing === 'both' || isResizing === 'bottom') {
          nextH = Math.max(240, windowStart.current.h + dy);
        }

        onUpdatePosition(win.x, win.y, nextW, nextH);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
      if (isResizing) setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, win, onUpdatePosition]);

  if (!win.isOpen) return null;

  // Genie minimize animation: shrink and pull towards bottom center of screen where the dock floats
  const isMin = win.isMinimized;
  const targetX = (window.innerWidth / 2) - win.x - (win.width / 2);
  const targetY = window.innerHeight - win.y - 40;

  return (
    <motion.div
      ref={windowRef}
      onMouseDown={onFocus}
      onMouseEnter={onWindowEnter}
      onMouseLeave={onWindowLeave}
      initial={disableAnimations ? false : { opacity: 0, scale: 0.9, y: 20 }}
      animate={
        disableAnimations
          ? {}
          : isMin
          ? {
              opacity: 0,
              scale: 0.15,
              x: targetX,
              y: targetY,
              rotate: -3,
              pointerEvents: 'none' as const,
            }
          : {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              rotate: 0,
              pointerEvents: 'auto' as const,
              // Direct coordinates using CSS values inside style properties
            }
      }
      transition={
        disableAnimations 
          ? { duration: 0 } 
          : isMin 
          ? { duration: 0.35, ease: [0.25, 1, 0.5, 1] } 
          : { type: 'spring', damping: 25, stiffness: 220 }
      }
      style={{
        position: 'absolute',
        zIndex: win.zIndex,
        left: win.isMaximized ? 0 : win.x,
        top: win.isMaximized ? 0 : win.y,
        width: win.isMaximized ? '100%' : win.width,
        height: win.isMaximized ? 'calc(100% - 64px)' : win.height,
        // Smooth scaling when transitioning from Maximized to Normal
        transition: (isDragging || isResizing || disableAnimations) 
          ? 'none' 
          : 'left 0.3s cubic-bezier(0.25, 1, 0.5, 1), top 0.3s cubic-bezier(0.25, 1, 0.5, 1), width 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
        display: (isMin && disableAnimations) ? 'none' : 'flex',
      }}
      className={`pointer-events-auto flex flex-col overflow-hidden border ${
        themeStyle === 'retro-terminal' ? 'rounded-none border-2' : 'rounded-xl'
      } ${
        themeStyle === 'glass' ? 'backdrop-blur-md' : ''
      } ${
        disableAnimations ? 'transition-none' : 'transition-shadow duration-200'
      } ${getBorderColorClass()} ${active ? 'window-active shadow-2xl' : ''}`}
    >
      {/* Title Bar Header */}
      <div
        onMouseDown={handleDragStart}
        onDoubleClick={onMaximize}
        onMouseEnter={onHeaderEnter}
        onMouseLeave={onHeaderLeave}
        className={`px-4 py-2 flex items-center justify-between cursor-move select-none shrink-0 relative h-9 ${getHeaderBgClass()}`}
      >
        {/* macOS circular color dots on the left */}
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="win-btn group relative w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Close"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-extrabold text-black/60 absolute leading-none">×</span>
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="win-btn group relative w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title="Minimize"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[8px] font-extrabold text-black/60 absolute leading-none">−</span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="win-btn group relative w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title={win.isMaximized ? 'Restore Down' : 'Maximize'}
          >
            <span className="opacity-0 group-hover:opacity-100 text-[6px] font-extrabold text-black/60 absolute leading-none">＋</span>
          </button>
        </div>

        {/* Centered Title text */}
        <div className="absolute inset-x-0 top-0 bottom-0 flex items-center justify-center pointer-events-none">
          <span className="text-[11.5px] font-medium tracking-wide font-sans text-slate-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {win.title}
          </span>
        </div>

        {/* Right-aligned small status point */}
        <div className="w-12 h-1 flex justify-end items-center z-10 pr-0.5">
          {active && (
            <span className={`w-1.5 h-1.5 rounded-full shadow-sm ${
              accentColor === 'green' ? 'bg-emerald-400' : accentColor === 'white' ? 'bg-slate-300' : 'bg-blue-400'
            }`} />
          )}
        </div>
      </div>

      {/* Main Window Content */}
      <div className="flex-1 min-h-0 bg-slate-950 overflow-hidden relative">
        {children}
      </div>

      {/* Multi-Edge & Corner Resize Handles (hidden in maximized mode) */}
      {!win.isMaximized && (
        <>
          {/* Bottom border resize bar */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'bottom')}
            className="absolute bottom-0 left-0 right-3.5 h-1.5 cursor-ns-resize z-50 hover:bg-blue-500/10 transition-colors"
            title="Drag bottom edge to resize"
          />
          {/* Right border resize bar */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'right')}
            className="absolute top-0 bottom-3.5 right-0 w-1.5 cursor-ew-resize z-50 hover:bg-blue-500/10 transition-colors"
            title="Drag right edge to resize"
          />
          {/* Bottom-right corner drag handle */}
          <div
            onMouseDown={(e) => handleResizeStart(e, 'both')}
            className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize z-50 group flex items-end justify-end p-0.5 bg-transparent"
            title="Drag corner to resize"
          >
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none" className="text-slate-500 group-hover:text-blue-400 transition-colors">
              <line x1="5" y1="1" x2="1" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              <line x1="5" y1="3" x2="3" y2="5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
        </>
      )}
    </motion.div>
  );
}

