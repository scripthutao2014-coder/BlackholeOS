import { FileSystem, Wallpaper } from './types';

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  {
    id: 'singularity',
    name: 'Cosmic Singularity (Default)',
    type: 'canvas',
    value: 'singularity',
    previewClass: 'bg-radial from-slate-950 via-blue-950 to-black',
  },
  {
    id: 'aurora-borealis',
    name: 'Quantum Aurora',
    type: 'gradient',
    value: 'linear-gradient(135deg, #020617 0%, #022c22 50%, #030712 100%)',
    previewClass: 'bg-gradient-to-br from-slate-950 via-emerald-950 to-gray-950',
  },
  {
    id: 'deep-space',
    name: 'Event Horizon',
    type: 'gradient',
    value: 'linear-gradient(135deg, #020617 0%, #1e1b4b 60%, #030712 100%)',
    previewClass: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950',
  },
  {
    id: 'nebula-green',
    name: 'Emerald Nebula',
    type: 'gradient',
    value: 'linear-gradient(135deg, #020617 0%, #064e3b 40%, #022c22 80%, #090d16 100%)',
    previewClass: 'bg-gradient-to-br from-slate-950 via-green-950 to-zinc-950',
  },
  {
    id: 'pitch-black',
    name: 'Vantablack Void',
    type: 'solid',
    value: '#020205',
    previewClass: 'bg-zinc-950',
  },
];

export const INITIAL_FILE_SYSTEM: FileSystem = {
  '/': {
    name: 'root',
    type: 'directory',
    path: '/',
  },
  '/home': {
    name: 'home',
    type: 'directory',
    path: '/home',
  },
  '/home/documents': {
    name: 'documents',
    type: 'directory',
    path: '/home/documents',
  },
  '/home/downloads': {
    name: 'downloads',
    type: 'directory',
    path: '/home/downloads',
  },
  '/home/pictures': {
    name: 'pictures',
    type: 'directory',
    path: '/home/pictures',
  },
  '/home/documents/E2E_Security.txt': {
    name: 'E2E_Security.txt',
    type: 'file',
    path: '/home/documents/E2E_Security.txt',
    content: `=== BLACKHOLE OS - END-TO-END SECURITY COMPLIANCE ===
Version: 1.0.0-Beta
Security Protocol: Quantum E2EE (End-to-End Encryption)

Security Highlights:
1. Client-Side Sandboxing: Since BlackholeOS runs entirely inside a secure browser sandboxed layer, your session data is insulated from host system telemetry.
2. Local Storage Encryption: System configurations and credentials are saved locally in the browser with session integrity flags.
3. ChatApp Integration: Fully compliant with the ExtinctionIBT communication network. All messages sent through the launcher are routed through HTTPS-protected nodes.

Status: ENCRYPTED & SECURE`,
  },
  '/home/documents/os_notes.txt': {
    name: 'os_notes.txt',
    type: 'file',
    path: '/home/documents/os_notes.txt',
    content: `=== BLACKHOLE OS SYSTEM OPTIMIZATION NOTES ===
Target Device Architecture: Low-End PCs (Optimized for 2GB RAM systems)
Engine: Virtual Dom Lightweight Operating System

Performance Enhancements:
- UI Thread Isolation: Minimizes DOM reflow during window drags.
- Event Delegation: Mouse & touch listener overhead is strictly minimized.
- Fast Loading State: Boot sequence loads core subsystems sequentially to avoid CPU spikes.
- GPU Accelerated Canvas: The desktop background runs on an optimized particles engine.

Experience seamless, ultra-responsive cloud computing.`,
  },
  '/home/pictures/mascot_info.txt': {
    name: 'mascot_info.txt',
    type: 'file',
    path: '/home/pictures/mascot_info.txt',
    content: `=== MEET THE BLACK ANOMALY DUCK ===
Official Mascot of BlackholeOS!

       (o<  "Quack the Singularity!"
    \\_(_ )=
      \`-T'
    
Name: B.A.D. (Black Anomaly Duck)
Colors: Obsidian Black & Cosmic Blue Accent

Biography:
Born in the high-density singularity of the Black Hole, B.A.D. represents our core design philosophy: compact, high gravitational pull (performance), and incredibly lightweight. 
While traditional operating system mascots are heavy, B.A.D. floats effortlessly across low-end browser hardware, compressing memory leaks into infinite densities!`,
  },
  '/home/downloads/ibt_links.txt': {
    name: 'ibt_links.txt',
    type: 'file',
    path: '/home/downloads/ibt_links.txt',
    content: `=== EXTINCTION IBT LINKS ===
- Core Web Application: https://scripthutao2014-coder.github.io/IBT-App/
- System Version: BlackholeOS 1.0.0
- Network Provider: ExtinctionIBT Core Services

Double click the ChatApp on the desktop to launch the secure portal!`,
  },
};
