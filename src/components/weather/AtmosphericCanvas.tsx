import React, { useEffect, useRef } from 'react';
import { WeatherData } from '../../types/weather';
import { decodeWmoCode } from '../../services/weatherService';
import { useWeatherTheme } from '../../context/WeatherThemeContext';

interface AtmosphericCanvasProps {
  weather: WeatherData;
  className?: string;
  intensity?: number;
  showConstellationPatterns?: boolean;
}

interface ParticleItem {
  x: number;
  y: number;
  z: number;
  size: number;
  vx: number;
  vy: number;
  flip: number;
  flipSpeed: number;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  color: string;
}

interface AnimeCloudPuff {
  ox: number;
  oy: number;
  r: number;
  colorTop: string;
  colorBottom: string;
}

interface AnimeTowerCloud {
  x: number;
  y: number;
  scale: number;
  speed: number;
  puffs: AnimeCloudPuff[];
}

export function AtmosphericCanvas({
  weather,
  className = '',
  intensity = 1.0,
  showConstellationPatterns = true
}: AtmosphericCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const { theme } = useWeatherTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const wmo = decodeWmoCode(weather.current.weatherCode, weather.current.isDay);
    const category = wmo.category;
    const isDay = weather.current.isDay;
    const windKmh = weather.current.windSpeed || 12;
    const windAngleRad = ((weather.current.windDirection || 210) * Math.PI) / 180;
    const windVx = Math.sin(windAngleRad) * (windKmh / 20) * intensity;

    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;
    const isSunset = hour >= 16.5 && hour <= 20.0;
    const isNight = !isDay || hour < 5.0 || hour > 21.0;

    // Modular Theme Sky Palette
    const palette = (() => {
      if (category === 'rain' || category === 'drizzle' || category === 'thunderstorm') {
        return {
          skyTop: theme.skyPalette.sunsetTop,
          skyMid: theme.skyPalette.dayMid,
          skyBottom: '#bae6fd',
          sunBeam: theme.skyPalette.sunBeam,
          cloudTop: 'rgba(255, 255, 255, 0.95)',
          cloudMid: theme.skyPalette.cloudMid,
          cloudShadow: theme.skyPalette.cloudShadow,
          hillFar: theme.skyPalette.hillFar,
          hillNear: theme.skyPalette.hillNear
        };
      }
      if (isSunset) {
        return {
          skyTop: theme.skyPalette.sunsetTop,
          skyMid: theme.skyPalette.sunsetMid,
          skyBottom: theme.skyPalette.sunsetBottom,
          sunBeam: theme.skyPalette.sunBeam,
          cloudTop: theme.skyPalette.cloudTop,
          cloudMid: theme.skyPalette.cloudMid,
          cloudShadow: theme.skyPalette.cloudShadow,
          hillFar: theme.skyPalette.hillFar,
          hillNear: theme.skyPalette.hillNear
        };
      }
      if (isNight) {
        return {
          skyTop: theme.skyPalette.nightTop,
          skyMid: theme.skyPalette.nightMid,
          skyBottom: theme.skyPalette.nightBottom,
          sunBeam: theme.skyPalette.sunBeam,
          cloudTop: theme.skyPalette.cloudTop,
          cloudMid: theme.skyPalette.cloudMid,
          cloudShadow: theme.skyPalette.cloudShadow,
          hillFar: theme.skyPalette.hillFar,
          hillNear: theme.skyPalette.hillNear
        };
      }
      return {
        skyTop: theme.skyPalette.dayTop,
        skyMid: theme.skyPalette.dayMid,
        skyBottom: theme.skyPalette.dayBottom,
        sunBeam: theme.skyPalette.sunBeam,
        cloudTop: theme.skyPalette.cloudTop,
        cloudMid: theme.skyPalette.cloudMid,
        cloudShadow: theme.skyPalette.cloudShadow,
        hillFar: theme.skyPalette.hillFar,
        hillNear: theme.skyPalette.hillNear
      };
    })();

    // 1. Towering Cumulonimbus Clouds
    const clouds: AnimeTowerCloud[] = [];
    const cloudCount = category === 'cloudy' ? 5 : category === 'partly-cloudy' ? 4 : 3;

    for (let c = 0; c < cloudCount; c++) {
      const puffs: AnimeCloudPuff[] = [];
      const baseR = 55 + Math.random() * 45;
      const puffCount = 7 + Math.floor(Math.random() * 4);

      for (let p = 0; p < puffCount; p++) {
        puffs.push({
          ox: (p - puffCount / 2) * (baseR * 0.68) + (Math.random() - 0.5) * 20,
          oy: (Math.random() - 0.5) * 30 - (p === Math.floor(puffCount / 2) ? 25 : 0),
          r: baseR * (0.75 + Math.random() * 0.4),
          colorTop: palette.cloudTop,
          colorBottom: isSunset ? palette.cloudMid : palette.cloudShadow
        });
      }

      clouds.push({
        x: Math.random() * (width + 400) - 200,
        y: 60 + Math.random() * (height * 0.32),
        scale: 0.9 + Math.random() * 0.5,
        speed: (0.15 + Math.random() * 0.25 + (windKmh / 50)) * (windVx >= 0 ? 1 : -1),
        puffs
      });
    }

    // 2. Modular Particles (Sakura, Dandelion, Golden Motes, Aurora Dust, Snowflakes, Starlight)
    const particles: ParticleItem[] = [];
    const particleColors = theme.skyPalette.particleColors;
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 0.6 + Math.random() * 0.8,
        size: 7 + Math.random() * 7,
        vx: 1.0 + Math.random() * 1.6 + windVx * 0.4,
        vy: 0.6 + Math.random() * 1.2,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.03 + Math.random() * 0.05,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        opacity: 0.65 + Math.random() * 0.35,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    }

    // 3. Rain & Night Stars
    const rainDrops: Array<{ x: number; y: number; speed: number; length: number; opacity: number }> = [];
    const ripples: Array<{ x: number; y: number; r: number; maxR: number; alpha: number }> = [];
    const stars: Array<{ x: number; y: number; radius: number; alpha: number; delta: number; glint: boolean }> = [];
    const sunRays: Array<{ angle: number; width: number; alpha: number; speed: number }> = [];

    if (category === 'rain' || category === 'drizzle' || category === 'thunderstorm') {
      const count = category === 'thunderstorm' ? 220 : 140;
      for (let i = 0; i < count; i++) {
        rainDrops.push({
          x: Math.random() * (width + 300) - 150,
          y: Math.random() * height,
          speed: (14 + Math.random() * 10) * intensity,
          length: 16 + Math.random() * 20,
          opacity: 0.5 + Math.random() * 0.4
        });
      }
    } else if (isNight || showConstellationPatterns) {
      const starCount = isNight ? 110 : 45;
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.62),
          radius: 1.1 + Math.random() * 2.2,
          alpha: (isNight ? 0.35 : 0.18) + Math.random() * 0.55,
          delta: 0.008 + Math.random() * 0.014,
          glint: Math.random() > 0.65
        });
      }
    }
    if (!isNight && category !== 'rain' && category !== 'thunderstorm') {
      for (let i = 0; i < 6; i++) {
        sunRays.push({
          angle: -0.4 + (i * 0.15) + (Math.random() * 0.03),
          width: 0.12 + Math.random() * 0.08,
          alpha: 0.15 + Math.random() * 0.12,
          speed: 0.0003 + Math.random() * 0.0003
        });
      }
    }

    // 3b. Live Sky Constellation Patterns (Ursa Major, Cassiopeia, Orion, Cygnus, Leo)
    const skyConstellations = [
      {
        name: 'URSA MAJOR',
        cx: 0.18,
        cy: 0.18,
        stars: [
          { dx: -68, dy: -16, r: 3.1, color: '#fdba74', label: 'Dubhe' },
          { dx: -62, dy: 14, r: 2.5, color: '#e0f2fe' },
          { dx: -24, dy: 20, r: 2.5, color: '#e0f2fe' },
          { dx: -14, dy: -6, r: 2.2, color: '#f8fafc' },
          { dx: 18, dy: 2, r: 2.9, color: '#e0f2fe', label: 'Alioth' },
          { dx: 46, dy: 8, r: 2.6, color: '#e0f2fe', label: 'Mizar' },
          { dx: 76, dy: 24, r: 2.8, color: '#93c5fd', label: 'Alkaid' }
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]]
      },
      {
        name: 'CASSIOPEIA',
        cx: 0.48,
        cy: 0.13,
        stars: [
          { dx: -52, dy: -12, r: 2.7, color: '#fef08a', label: 'Caph' },
          { dx: -24, dy: 16, r: 3.0, color: '#fdba74', label: 'Schedar' },
          { dx: 2, dy: -4, r: 2.8, color: '#93c5fd', label: 'Tsih' },
          { dx: 28, dy: 18, r: 2.5, color: '#e0f2fe' },
          { dx: 54, dy: -8, r: 2.3, color: '#93c5fd' }
        ],
        lines: [[0, 1], [1, 2], [2, 3], [3, 4]]
      },
      {
        name: 'ORION',
        cx: 0.78,
        cy: 0.24,
        stars: [
          { dx: -28, dy: -42, r: 3.6, color: '#fca5a5', label: 'Betelgeuse' },
          { dx: 24, dy: -34, r: 2.7, color: '#bae6fd', label: 'Bellatrix' },
          { dx: -10, dy: -2, r: 2.5, color: '#bae6fd' },
          { dx: 0, dy: 2, r: 2.7, color: '#bae6fd', label: 'Alnilam' },
          { dx: 10, dy: 6, r: 2.5, color: '#bae6fd' },
          { dx: -24, dy: 44, r: 2.5, color: '#93c5fd' },
          { dx: 28, dy: 40, r: 3.7, color: '#93c5fd', label: 'Rigel' }
        ],
        lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6], [5, 6]]
      },
      {
        name: 'CYGNUS',
        cx: 0.34,
        cy: 0.31,
        stars: [
          { dx: 0, dy: -36, r: 3.3, color: '#e0f2fe', label: 'Deneb' },
          { dx: 0, dy: -6, r: 2.7, color: '#fef08a', label: 'Sadr' },
          { dx: 0, dy: 34, r: 2.5, color: '#fdba74', label: 'Albireo' },
          { dx: -38, dy: -2, r: 2.4, color: '#bae6fd' },
          { dx: 38, dy: 4, r: 2.5, color: '#fdba74' }
        ],
        lines: [[0, 1], [1, 2], [3, 1], [1, 4]]
      }
    ];
    let constellationDrift = 0;
    const shootingStars: Array<{ x: number; y: number; vx: number; vy: number; len: number; alpha: number }> = [];

    // 4. Interactive Pointer Burst
    const interactiveParticles: ParticleItem[] = [];
    const maxInteractive = 30;

    const spawnInteractive = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      for (let i = 0; i < 2; i++) {
        if (interactiveParticles.length >= maxInteractive) {
          interactiveParticles.shift();
        }
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 2.5;

        interactiveParticles.push({
          x,
          y,
          z: 1.0,
          size: 9 + Math.random() * 6,
          vx: Math.cos(angle) * speed + windVx * 0.4,
          vy: Math.sin(angle) * speed - 0.5,
          flip: Math.random() * Math.PI,
          flipSpeed: 0.05 + Math.random() * 0.05,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.08,
          opacity: 0.95,
          color: particleColors[Math.floor(Math.random() * particleColors.length)]
        });
      }
    };

    const handlePointerMove = (e: MouseEvent) => spawnInteractive(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) spawnInteractive(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    let turbineAngle = 0;

    // Render Particle based on modular theme particleType
    const renderModularParticle = (p: ParticleItem) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      const pType = theme.particleType;

      if (pType === 'sakura') {
        // 3D Tumbling Notched Sakura Petal
        ctx.scale(Math.cos(p.flip), 1.0);
        const grad = ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, '#fce7f3');
        grad.addColorStop(0.8, '#f472b6');
        grad.addColorStop(1, '#db2777');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, p.size);
        ctx.bezierCurveTo(-p.size * 0.8, p.size * 0.5, -p.size * 0.9, -p.size * 0.5, -p.size * 0.3, -p.size);
        ctx.lineTo(0, -p.size * 0.7);
        ctx.lineTo(p.size * 0.3, -p.size);
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.5, p.size * 0.8, p.size * 0.5, 0, p.size);
        ctx.closePath();
        ctx.fill();
      } else if (pType === 'snowflake') {
        // 6-Point Crystalline Snowflake
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        for (let b = 0; b < 6; b++) {
          ctx.rotate(Math.PI / 3);
          ctx.moveTo(0, 0);
          ctx.lineTo(0, p.size);
          ctx.moveTo(0, p.size * 0.5);
          ctx.lineTo(p.size * 0.25, p.size * 0.75);
          ctx.moveTo(0, p.size * 0.5);
          ctx.lineTo(-p.size * 0.25, p.size * 0.75);
        }
        ctx.stroke();
      } else if (pType === 'dandelion') {
        // Soft Dandelion Parachute Seed
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, p.size * 1.5);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        for (let r = 0; r < 5; r++) {
          const a = (r / 5) * Math.PI - Math.PI / 2;
          ctx.beginPath();
          ctx.arc(Math.cos(a) * p.size * 0.6, -Math.sin(a) * p.size * 0.6, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Glowing Golden / Aurora / Cosmic Starlight Glint
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.8);
        ctx.quadraticCurveTo(0, 0, p.size * 1.8, 0);
        ctx.quadraticCurveTo(0, 0, 0, p.size * 1.8);
        ctx.quadraticCurveTo(0, 0, -p.size * 1.8, 0);
        ctx.quadraticCurveTo(0, 0, 0, -p.size * 1.8);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    };

    // Main 60fps render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // A. Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, palette.skyTop);
      skyGrad.addColorStop(0.52, palette.skyMid);
      skyGrad.addColorStop(1, palette.skyBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // B. Crepuscular Light Beams
      if (sunRays.length > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        const sunX = width * 0.8;
        const sunY = height * 0.1;

        sunRays.forEach(ray => {
          ray.angle += ray.speed;
          const rayGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, height * 0.9);
          rayGrad.addColorStop(0, palette.sunBeam);
          rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(sunX, sunY);
          ctx.arc(sunX, sunY, height * 0.9, ray.angle, ray.angle + ray.width);
          ctx.closePath();
          ctx.fill();
        });
        ctx.restore();
      }

      // C. Twinkling Night Stars & Live Constellation Star Patterns in Sky
      if (stars.length > 0) {
        stars.forEach(st => {
          st.alpha += st.delta;
          if (st.alpha > 0.95 || st.alpha < 0.2) st.delta *= -1;

          ctx.beginPath();
          ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 240, 138, ${st.alpha})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#fef08a';
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      if (showConstellationPatterns) {
        constellationDrift += 0.035;
        const baseAlpha = isNight ? 0.78 : isSunset ? 0.62 : 0.44;

        ctx.save();
        skyConstellations.forEach((con) => {
          const originX = ((con.cx * width + constellationDrift) % (width + 160)) - 80;
          const originY = con.cy * Math.min(height, 680);

          // Constellation Filament Lines
          ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.42)' : 'rgba(254, 240, 138, 0.38)';
          ctx.lineWidth = 1.25;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          con.lines.forEach(([iA, iB]) => {
            const sA = con.stars[iA];
            const sB = con.stars[iB];
            ctx.moveTo(originX + sA.dx, originY + sA.dy);
            ctx.lineTo(originX + sB.dx, originY + sB.dy);
          });
          ctx.stroke();
          ctx.setLineDash([]);

          // Constellation Stars & Spectral Halos
          con.stars.forEach((st) => {
            const sx = originX + st.dx;
            const sy = originY + st.dy;

            ctx.beginPath();
            ctx.arc(sx, sy, st.r * 2.4, 0, Math.PI * 2);
            ctx.fillStyle = st.color;
            ctx.globalAlpha = baseAlpha * 0.26;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(sx, sy, st.r, 0, Math.PI * 2);
            ctx.fillStyle = st.color;
            ctx.globalAlpha = baseAlpha;
            ctx.shadowBlur = 8;
            ctx.shadowColor = st.color;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (st.label) {
              ctx.font = '600 9px monospace';
              ctx.fillStyle = 'rgba(248, 250, 252, 0.68)';
              ctx.globalAlpha = baseAlpha * 0.85;
              ctx.fillText(st.label, sx + st.r + 4, sy + 3);
            }
          });

          // Constellation Title Watermark
          ctx.font = '800 9px monospace';
          ctx.fillStyle = isNight ? 'rgba(186, 230, 253, 0.55)' : 'rgba(254, 249, 195, 0.52)';
          ctx.globalAlpha = baseAlpha;
          ctx.fillText(`✦ ${con.name}`, originX - 28, originY - 50);
        });

        // Occasional Shooting Star / Meteor Streak
        if (Math.random() < 0.005 && shootingStars.length < 2) {
          shootingStars.push({
            x: Math.random() * width * 0.8 + width * 0.1,
            y: Math.random() * height * 0.25 + 20,
            vx: 6 + Math.random() * 5,
            vy: 2.5 + Math.random() * 2.5,
            len: 55 + Math.random() * 45,
            alpha: 0.95
          });
        }

        for (let s = shootingStars.length - 1; s >= 0; s--) {
          const mt = shootingStars[s];
          mt.x += mt.vx;
          mt.y += mt.vy;
          mt.alpha *= 0.95;

          const tailGrad = ctx.createLinearGradient(
            mt.x,
            mt.y,
            mt.x - mt.vx * 8,
            mt.y - mt.vy * 8
          );
          tailGrad.addColorStop(0, `rgba(254, 240, 138, ${mt.alpha})`);
          tailGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.strokeStyle = tailGrad;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(mt.x, mt.y);
          ctx.lineTo(mt.x - mt.vx * 8, mt.y - mt.vy * 8);
          ctx.stroke();

          if (mt.alpha < 0.06) {
            shootingStars.splice(s, 1);
          }
        }
        ctx.restore();
      }

      // D. Towering Cumulonimbus Clouds
      clouds.forEach(cl => {
        cl.x += cl.speed;
        if (cl.speed > 0 && cl.x - 300 > width) cl.x = -350;
        if (cl.speed < 0 && cl.x + 300 < 0) cl.x = width + 350;

        ctx.save();
        ctx.translate(cl.x, cl.y);
        ctx.scale(cl.scale, cl.scale);

        cl.puffs.forEach(pf => {
          ctx.beginPath();
          ctx.arc(pf.ox, pf.oy + 12, pf.r, 0, Math.PI * 2);
          ctx.fillStyle = palette.cloudShadow;
          ctx.globalAlpha = 0.45;
          ctx.fill();
        });

        cl.puffs.forEach(pf => {
          const grad = ctx.createRadialGradient(
            pf.ox - pf.r * 0.28, pf.oy - pf.r * 0.32, pf.r * 0.1,
            pf.ox, pf.oy, pf.r
          );
          grad.addColorStop(0, pf.colorTop);
          grad.addColorStop(0.7, pf.colorBottom);
          grad.addColorStop(1, palette.cloudShadow);

          ctx.beginPath();
          ctx.arc(pf.ox, pf.oy, pf.r, 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.globalAlpha = 0.95;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(pf.ox, pf.oy, pf.r, Math.PI * 1.1, Math.PI * 1.9);
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.0;
          ctx.globalAlpha = 0.7;
          ctx.stroke();
        });

        ctx.restore();
      });

      // E. Landscape Ridge & Silhouette
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 30) {
        const hillY = height - 120 - Math.sin(x * 0.002 + 0.5) * 50 - Math.cos(x * 0.005) * 22;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = palette.hillFar;
      ctx.globalAlpha = 0.5;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(0, height);
      for (let x = 0; x <= width; x += 25) {
        const hillY = height - 70 - Math.sin(x * 0.0035) * 38 - Math.cos(x * 0.008) * 18;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = palette.hillNear;
      ctx.globalAlpha = 0.65;
      ctx.fill();

      // Distant Wind Turbines
      turbineAngle += 0.02;
      const turbinePositions = [width * 0.22, width * 0.72];
      turbinePositions.forEach(tx => {
        const ty = height - 120 - Math.sin(tx * 0.002 + 0.5) * 50 - Math.cos(tx * 0.005) * 22;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx, ty - 38);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.save();
        ctx.translate(tx, ty - 38);
        ctx.rotate(turbineAngle);
        for (let b = 0; b < 3; b++) {
          ctx.rotate((Math.PI * 2) / 3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(0, -18);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
        ctx.restore();
      });

      // Wildflower Crest Dots
      for (let x = 30; x < width; x += 55) {
        const hillY = height - 70 - Math.sin(x * 0.0035) * 38 - Math.cos(x * 0.008) * 18;
        ctx.beginPath();
        ctx.arc(x, hillY - 3, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = x % 110 === 0 ? theme.accentColors.primary : x % 165 === 0 ? theme.accentColors.secondary : '#38bdf8';
        ctx.globalAlpha = 0.8;
        ctx.fill();
      }
      ctx.restore();

      // F. Modular Floating Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.flip += p.flipSpeed;
        p.rotation += p.rotSpeed;

        if (p.x > width + 40) p.x = -40;
        if (p.y > height + 40) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        renderModularParticle(p);
      });

      // G. Interactive Pointer Burst
      for (let i = interactiveParticles.length - 1; i >= 0; i--) {
        const p = interactiveParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.flip += p.flipSpeed;
        p.rotation += p.rotSpeed;
        p.opacity *= 0.96;

        renderModularParticle(p);

        if (p.opacity <= 0.05) {
          interactiveParticles.splice(i, 1);
        }
      }

      // H. Rain Streaks & Water Ripples
      if (rainDrops.length > 0) {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.75)';
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        rainDrops.forEach(d => {
          d.x += windVx * 1.5;
          d.y += d.speed;

          if (d.y > height - 30) {
            if (Math.random() < 0.28) {
              ripples.push({
                x: d.x,
                y: height - 20 + Math.random() * 10,
                r: 1,
                maxR: 14 + Math.random() * 10,
                alpha: 0.8
              });
            }
            d.y = -d.length;
            d.x = Math.random() * (width + 300) - 150;
          }

          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x + windVx * 2.5, d.y + d.length);
        });
        ctx.stroke();

        ripples.forEach((rp, idx) => {
          rp.r += 0.55;
          rp.alpha *= 0.94;
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, rp.r * 2.6, rp.r * 0.9, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(186, 230, 253, ${rp.alpha})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.restore();
          if (rp.alpha <= 0.05 || rp.r >= rp.maxR) {
            ripples.splice(idx, 1);
          }
        });
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [weather, intensity, theme, showConstellationPatterns]);

  return (
    <canvas 
      ref={canvasRef}
      className={`pointer-events-none transition-opacity duration-1000 ${className}`}
    />
  );
}
