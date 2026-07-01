import { useEffect, useRef } from 'react';

interface BlackholeBackgroundProps {
  mode: 'boot' | 'desktop' | 'login';
  accentColor?: 'blue' | 'green' | 'white';
  isPaused?: boolean;
}

interface Particle {
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  color: string;
  alpha: number;
}

export default function BlackholeBackground({ mode, accentColor = 'blue', isPaused = false }: BlackholeBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Store isPaused in ref to access inside the requestAnimationFrame closure safely
  const isPausedRef = useRef(isPaused);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    // Handle container resizing via ResizeObserver with robust try-catch and resize fallback
    let resizeObserver: ResizeObserver | null = null;
    const handleResizeFallback = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };

    if (typeof window !== 'undefined' && 'ResizeObserver' in window && typeof window.ResizeObserver === 'function') {
      try {
        resizeObserver = new window.ResizeObserver((entries) => {
          for (const entry of entries) {
            width = entry.contentRect.width || container.clientWidth;
            height = entry.contentRect.height || container.clientHeight;
            canvas.width = width;
            canvas.height = height;
          }
        });
        resizeObserver.observe(container);
      } catch (err) {
        console.warn('Failed to construct ResizeObserver, falling back to window resize listener:', err);
        window.addEventListener('resize', handleResizeFallback);
      }
    } else {
      window.addEventListener('resize', handleResizeFallback);
    }

    // Color definitions based on active settings
    const getColorPalette = () => {
      if (accentColor === 'green') {
        return {
          primary: 'rgba(16, 185, 129, ', // emerald
          secondary: 'rgba(52, 211, 153, ',
          glow: '#10b981',
        };
      } else if (accentColor === 'white') {
        return {
          primary: 'rgba(243, 244, 246, ', // white/slate
          secondary: 'rgba(156, 163, 175, ',
          glow: '#f3f4f6',
        };
      } else {
        return {
          primary: 'rgba(59, 130, 246, ', // blue
          secondary: 'rgba(96, 165, 250, ',
          glow: '#3b82f6',
        };
      }
    };

    // Particles system
    const particleCount = mode === 'boot' ? 220 : 120;
    const particles: Particle[] = [];
    const colors = getColorPalette();

    const createParticle = (index: number): Particle => {
      const radiusMin = mode === 'boot' ? 30 : 60;
      const radiusMax = Math.min(width, height) * (mode === 'boot' ? 0.6 : 0.45);
      const radius = radiusMin + Math.random() * (radiusMax - radiusMin);
      
      // Determine colors
      const isGreenAccent = Math.random() > 0.4;
      let particleColor = isGreenAccent ? 'rgba(16, 185, 129, ' : 'rgba(59, 130, 246, ';
      if (accentColor === 'green') {
        particleColor = Math.random() > 0.4 ? 'rgba(16, 185, 129, ' : 'rgba(52, 211, 153, ';
      } else if (accentColor === 'white') {
        particleColor = Math.random() > 0.4 ? 'rgba(243, 244, 246, ' : 'rgba(156, 163, 175, ';
      }

      return {
        x: 0,
        y: 0,
        angle: Math.random() * Math.PI * 2,
        radius: radius,
        // Boot mode has faster orbit and spiraling
        speed: (mode === 'boot' ? 0.015 : 0.003) * (0.5 + Math.random() * 1.5) * (Math.random() > 0.1 ? 1 : -0.5),
        size: 0.5 + Math.random() * (mode === 'boot' ? 2 : 1.5),
        color: particleColor,
        alpha: 0.1 + Math.random() * 0.7,
      };
    };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(i));
    }

    // Interactive mouse coordinates
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    };

    if (mode !== 'boot') {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Simulation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(2, 2, 5, 0.15)'; // Trail effect for blackhole
      ctx.fillRect(0, 0, width, height);

      // Interpolate mouse for smooth lagging movement (magnetic gravity center)
      const centerX = mode === 'boot' ? width / 2 : (isPausedRef.current ? mouseX : (mouseX += (targetMouseX - mouseX) * 0.05));
      const centerY = mode === 'boot' ? height / 2 : (isPausedRef.current ? mouseY : (mouseY += (targetMouseY - mouseY) * 0.05));

      const activeColors = getColorPalette();

      // Draw general accretion disk background glow
      const glowRadius = Math.min(width, height) * (mode === 'boot' ? 0.18 : 0.12);
      const gradient = ctx.createRadialGradient(
        centerX, centerY, glowRadius * 0.2,
        centerX, centerY, glowRadius * 2
      );
      
      gradient.addColorStop(0, 'rgba(2, 2, 5, 1)');
      gradient.addColorStop(0.15, activeColors.primary + '0.25)');
      if (accentColor !== 'green' && mode === 'boot') {
        // Multi-color accretion disk in boot
        gradient.addColorStop(0.35, 'rgba(16, 185, 129, 0.12)'); 
      }
      gradient.addColorStop(0.6, activeColors.secondary + '0.04)');
      gradient.addColorStop(1, 'rgba(2, 2, 5, 0)');
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw lensing effect (Outer ring warp)
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = activeColors.primary + '0.15)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Update and draw orbital particles
      particles.forEach((p, index) => {
        // Orbit math
        if (!isPausedRef.current) {
          p.angle += p.speed;
        }
        
        // In boot mode, particles slowly fall into the singularity
        if (mode === 'boot') {
          if (!isPausedRef.current) {
            p.radius -= 0.18 * (1 + Math.random());
          }
          if (p.radius < 10) {
            // Re-spawn on outer bounds
            const radiusMax = Math.min(width, height) * 0.55;
            p.radius = radiusMax * (0.8 + Math.random() * 0.2);
            p.angle = Math.random() * Math.PI * 2;
          }
        } else if (mode === 'login') {
          // Subtle circular breathing fluctuation
          if (!isPausedRef.current) {
            p.radius += Math.sin(p.angle * 2) * 0.05;
          }
        }

        p.x = centerX + Math.cos(p.angle) * p.radius;
        p.y = centerY + Math.sin(p.angle) * p.radius;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();

        // Optional tiny connections for a neural look in login/desktop modes
        if (mode === 'desktop' && index < 25) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(centerX, centerY);
          ctx.strokeStyle = activeColors.primary + '0.015)';
          ctx.stroke();
        }
      });

      // Draw the Event Horizon (The core black sphere)
      const blackHoleRadius = glowRadius * 0.45;
      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#010103';
      ctx.fill();

      // Add a thin crisp border around the horizon
      ctx.beginPath();
      ctx.arc(centerX, centerY, blackHoleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = activeColors.primary + '0.7)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResizeFallback);
      if (mode !== 'boot') {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [mode, accentColor]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-black overflow-hidden select-none pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
