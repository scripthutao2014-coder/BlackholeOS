import React, { useState, useEffect, useRef } from 'react';
import { Camera, RefreshCw, Sparkles, Download, Volume2, VolumeX, Grid3X3, Film } from 'lucide-react';
import { FileSystem } from '../../types';

interface CameraAppProps {
  fileSystem: FileSystem;
  onUpdateFileSystem: (updatedFS: FileSystem) => void;
  onSetCameraActive?: (active: boolean, appName: string) => void;
}

const FILTERS = [
  { id: 'none', name: 'Normal', filter: 'none' },
  { id: 'cyberpunk', name: 'Cyberpunk', filter: 'hue-rotate(180deg) saturate(2) brightness(1.1) contrast(1.2)' },
  { id: 'sepia', name: 'Vintage Sepia', filter: 'sepia(0.85) contrast(0.95)' },
  { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(1) contrast(1.1)' },
  { id: 'invert', name: 'Ghost Invert', filter: 'invert(1) hue-rotate(180deg)' },
  { id: 'thermal', name: 'Thermal Vision', filter: 'saturate(2.5) hue-rotate(-90deg) contrast(1.5)' },
  { id: 'warm', name: 'Warm Sunset', filter: 'sepia(0.3) saturate(1.6) contrast(1.1)' },
];

export default function CameraApp({ fileSystem, onUpdateFileSystem, onSetCameraActive }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied' | 'simulated'>('pending');
  const [activeFilter, setActiveFilter] = useState(FILTERS[0]);
  const [showGrid, setShowGrid] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [photoSavedMessage, setPhotoSavedMessage] = useState<string | null>(null);

  // Notify parent of active camera usage for the Dynamic Island Privacy Indicator
  useEffect(() => {
    if (onSetCameraActive) {
      onSetCameraActive(true, 'Camera Application');
    }
    return () => {
      if (onSetCameraActive) {
        onSetCameraActive(false, '');
      }
    };
  }, [onSetCameraActive]);

  // Start video stream
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false })
      .then((mediaStream) => {
        setPermissionState('granted');
        setStream(mediaStream);
        activeStream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.warn('Real webcam access not granted or unavailable, starting simulated feed:', err);
        setPermissionState('simulated');
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Synthesize camera click audio via Web Audio API (extremely robust, requires no static assets)
  const playShutterSound = () => {
    if (!isSoundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Focus noise burst for shutter click
      const bufferSize = audioCtx.sampleRate * 0.15; // 0.15 seconds
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      // Filter to shape click
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(8000, audioCtx.currentTime + 0.1);

      // Gain node for fade out
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      whiteNoise.start();
    } catch (e) {
      console.warn('Audio Context failed to play sound:', e);
    }
  };

  const handleCapture = () => {
    if (countdown !== null) return;
    
    // Play sound and flash instantly if no countdown
    triggerFlashAndSave();
  };

  const handleCountdownCapture = (seconds: number) => {
    setCountdown(seconds);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          triggerFlashAndSave();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const triggerFlashAndSave = () => {
    setIsFlashing(true);
    playShutterSound();
    
    // Snapshot draw
    setTimeout(() => {
      setIsFlashing(false);
      savePhotoToFS();
    }, 150);
  };

  const savePhotoToFS = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 640;
    canvas.height = 480;

    // Draw background
    ctx.fillStyle = '#05070c';
    ctx.fillRect(0, 0, 640, 480);

    // Filter application
    ctx.filter = activeFilter.filter;

    if (permissionState === 'granted' && videoRef.current) {
      // Draw frame from real video
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    } else {
      // Draw simulation screen frame (futuristic cyber scan)
      const time = Date.now() * 0.002;
      
      // Gradient background
      const grad = ctx.createRadialGradient(320, 240, 50, 320, 240, 400);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 480);

      // Sci-fi scanner overlay lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 480; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(640, i);
        ctx.stroke();
      }

      // Scanner bar
      const barY = (Math.sin(time) + 1) * 240;
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, barY);
      ctx.lineTo(640, barY);
      ctx.stroke();

      // Cyber hologram head outline
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(320, 200, 80, 0, Math.PI * 2); // head
      ctx.moveTo(320, 280);
      ctx.lineTo(320, 310); // neck
      ctx.moveTo(220, 350);
      ctx.bezierCurveTo(250, 310, 390, 310, 420, 350); // shoulders
      ctx.stroke();

      // Diagnostics text
      ctx.font = '12px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('CAMERA SYSTEM: CORE_SIMULATED', 20, 40);
      ctx.fillText(`FILTER_ACTIVE: ${activeFilter.name.toUpperCase()}`, 20, 60);
      ctx.fillText(`TIME_LOG: ${new Date().toISOString()}`, 20, 80);
      
      ctx.beginPath();
      ctx.arc(600, 40, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444'; // blinking recording dot
      ctx.fill();
    }

    // Reset filter
    ctx.filter = 'none';

    // Output to image URL
    const dataUrl = canvas.toDataURL('image/png');

    // Create file inside /home/Pictures directory of virtual File System
    const timestamp = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '-');
    const fileName = `snapshot_${timestamp}.png`;
    const fullPath = `/home/${fileName}`;

    const updatedFS = { ...fileSystem };
    updatedFS[fullPath] = {
      name: fileName,
      type: 'file',
      path: fullPath,
      content: dataUrl, // Save base64 image data URL so FileExplorer and wallpaper can load it!
    };

    onUpdateFileSystem(updatedFS);
    
    setPhotoSavedMessage(`Saved: ${fileName}`);
    setTimeout(() => setPhotoSavedMessage(null), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-[#030509] text-white overflow-hidden relative select-text">
      {/* Canvas for snapshot capturing hidden */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Shutter flash overlay */}
      {isFlashing && (
        <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-fade-out" />
      )}

      {/* Header bar */}
      <div className="flex justify-between items-center px-4 py-2.5 bg-slate-950 border-b border-slate-900 select-none shrink-0">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-400">CORE WEBCAM MONITOR</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Grid Toggle */}
          <button 
            onClick={() => setShowGrid(!showGrid)} 
            className={`p-1.5 rounded hover:bg-slate-900 cursor-pointer text-xs ${showGrid ? 'text-amber-400 bg-slate-900' : 'text-slate-400'}`}
            title="Toggle Alignment Grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          
          {/* Shutter sound toggle */}
          <button 
            onClick={() => setIsSoundEnabled(!isSoundEnabled)} 
            className="p-1.5 rounded hover:bg-slate-900 cursor-pointer text-slate-400 text-xs"
            title={isSoundEnabled ? "Mute shutter sound" : "Unmute shutter sound"}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Main viewport area */}
      <div className="flex-1 min-h-0 relative bg-slate-950 flex items-center justify-center p-3">
        
        {/* Permission / Status Screens */}
        {permissionState === 'pending' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 z-20 select-none">
            <RefreshCw className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-semibold text-slate-300">Requesting Camera hardware access...</p>
            <p className="text-xs text-slate-500 mt-1">Please accept the permission dialog in your browser.</p>
          </div>
        )}

        {/* Shutter countdown indicator overlay */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65 z-30 pointer-events-none select-none">
            <span className="text-8xl font-black font-display text-white animate-scale-ping">{countdown}</span>
          </div>
        )}

        {/* Viewport frame */}
        <div className="w-full h-full max-w-[640px] max-h-[480px] aspect-[4/3] bg-black border border-slate-850 rounded-xl overflow-hidden relative flex items-center justify-center shadow-lg">
          {permissionState === 'granted' ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              referrerPolicy="no-referrer"
              style={{ filter: activeFilter.filter }}
              className="w-full h-full object-cover scale-x-[-1]" // mirror view is natural for users
            />
          ) : (
            /* Sci-fi Animation Simulation Feed */
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-[#010307]">
              {/* Scanline bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500/30 shadow-[0_0_8px_#10b981] animate-scan" />
              
              {/* Head outline SVG container */}
              <div className="text-emerald-500/20 w-48 h-48 select-none pointer-events-none animate-pulse-slow">
                <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full">
                  <path d="M50 15 A25 25 0 0 0 50 65 L50 78 M30 85 C35 75 65 75 70 85" strokeLinecap="round" />
                  <circle cx="50" cy="40" r="2" fill="currentColor" />
                </svg>
              </div>

              {/* Glowing notification badge */}
              <div className="absolute bottom-4 left-4 bg-emerald-950/80 border border-emerald-500/40 rounded-lg px-2.5 py-1 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>SECURE LINK: SIMULATED WEBCAM</span>
              </div>
            </div>
          )}

          {/* Guidelines Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none select-none">
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-r border-b border-white/15" />
              <div className="border-b border-white/15" />
              <div className="border-r border-white/15" />
              <div className="border-r border-white/15" />
              <div className="bg-transparent" />
            </div>
          )}

          {/* Filter name label transient HUD overlay */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-slate-800/80 rounded px-2 py-0.5 text-[10px] font-mono tracking-widest text-slate-300 pointer-events-none select-none">
            FILTER: {activeFilter.name.toUpperCase()}
          </div>

          {/* Snapshot success message */}
          {photoSavedMessage && (
            <div className="absolute top-4 right-4 bg-emerald-950 border border-emerald-500/80 rounded px-3 py-1 text-xs font-mono text-emerald-300 shadow-lg shadow-black/80 flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{photoSavedMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Control panel & Filter select bar */}
      <div className="bg-slate-950 border-t border-slate-900 px-4 py-3 select-none shrink-0 flex flex-col gap-3">
        {/* Filter selection carousel */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
          {FILTERS.map((filt) => (
            <button
              key={filt.id}
              onClick={() => setActiveFilter(filt)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                activeFilter.id === filt.id
                  ? 'bg-blue-600 border-blue-500 text-white font-bold'
                  : 'bg-slate-900 border-slate-850 hover:bg-slate-850 text-slate-400'
              }`}
            >
              {filt.name}
            </button>
          ))}
        </div>

        {/* Shutter controls */}
        <div className="flex items-center justify-between">
          {/* Quick shutter countdown triggers */}
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-850">
            <button 
              onClick={() => handleCapture()} 
              className="px-2 py-1 text-[10px] font-bold font-mono rounded hover:bg-slate-850 text-slate-300 cursor-pointer"
            >
              INSTANT
            </button>
            <button 
              onClick={() => handleCountdownCapture(3)} 
              className="px-2 py-1 text-[10px] font-bold font-mono rounded hover:bg-slate-850 text-slate-300 cursor-pointer"
            >
              3S TIMER
            </button>
            <button 
              onClick={() => handleCountdownCapture(5)} 
              className="px-2 py-1 text-[10px] font-bold font-mono rounded hover:bg-slate-850 text-slate-300 cursor-pointer"
            >
              5S TIMER
            </button>
          </div>

          {/* Core circular shutter button */}
          <button
            onClick={() => handleCapture()}
            className="w-12 h-12 rounded-full border-4 border-slate-800 bg-red-600 hover:bg-red-500 hover:scale-105 transition-all shadow-lg active:scale-95 flex items-center justify-center cursor-pointer"
            title="Take Photo Snapshot"
          >
            <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
          </button>

          {/* Quick folder instruction */}
          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline max-w-[150px] text-right">
            Captured frames save instantly in <b>Files</b>
          </span>
        </div>
      </div>
    </div>
  );
}
