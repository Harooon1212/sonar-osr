import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../store/useTheme';

// 6 known class centroids inside the bounded hypersphere + 4 unknown anomalies outside
const KNOWN_CLUSTERS = [
  { label: 'bottle', cx: -0.35, cy: 0.25, cz: 0.2 },
  { label: 'can', cx: 0.35, cy: 0.28, cz: -0.18 },
  { label: 'tire', cx: 0.05, cy: -0.38, cz: 0.26 },
  { label: 'carton', cx: 0.32, cy: -0.15, cz: -0.32 },
  { label: 'hook', cx: -0.32, cy: -0.22, cz: -0.24 },
  { label: 'propeller', cx: -0.04, cy: 0.38, cz: -0.25 },
];

const UNKNOWN_POINTS = [
  { label: 'chain', x: 0.88, y: 0.42, z: 0.35 },
  { label: 'valve', x: -0.82, y: -0.45, z: 0.42 },
  { label: 'shampoo', x: 0.15, y: 0.85, z: -0.52 },
  { label: 'standing-bottle', x: -0.55, y: 0.65, z: 0.62 },
  { label: 'anomaly-1', x: 0.68, y: -0.68, z: -0.42 },
  { label: 'anomaly-2', x: -0.78, y: 0.12, z: -0.64 },
];

function buildPoints() {
  const pts = [];
  KNOWN_CLUSTERS.forEach((c) => {
    pts.push({ x: c.cx, y: c.cy, z: c.cz, type: 'centroid', label: c.label });
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      pts.push({
        x: c.cx + Math.cos(a) * 0.08,
        y: c.cy + Math.sin(a * 1.3) * 0.08,
        z: c.cz + Math.sin(a) * 0.08,
        type: 'known',
      });
    }
  });
  UNKNOWN_POINTS.forEach((u) => {
    pts.push({ x: u.x, y: u.y, z: u.z, type: 'unknown', label: u.label });
  });
  return pts;
}

const POINTS = buildPoints();

export default function SonarHypersphere3D() {
  const canvasRef = useRef(null);
  const theme = useTheme((s) => s.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animId = null;
    let yaw = 0.4;
    let pitch = 0.28;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 240;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const project = (x, y, z) => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);

      const x1 = x * cy - z * sy;
      const z1 = x * sy + z * cy;
      const y2 = y * cp - z1 * sp;
      const z2 = y * sp + z1 * cp;

      const fov = 2.8;
      const scale = (fov / (fov + z2)) * 88;
      return {
        sx: size / 2 + x1 * scale,
        sy: size / 2 - y2 * scale,
        depth: z2,
        scale,
      };
    };

    const drawRing = (pts, stroke, lineWidth = 1, dashed = false) => {
      ctx.save();
      ctx.beginPath();
      if (dashed) ctx.setLineDash([3, 3]);
      pts.forEach((p, idx) => {
        const pr = project(p.x, p.y, p.z);
        if (idx === 0) ctx.moveTo(pr.sx, pr.sy);
        else ctx.lineTo(pr.sx, pr.sy);
      });
      ctx.closePath();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      if (!dragging) {
        yaw += 0.0065;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, size, size);

      const isDark = theme === 'dark';
      const sphereStroke = isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(47, 107, 255, 0.22)';
      const tauStroke = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(47, 107, 255, 0.42)';
      const coneStroke = isDark ? 'rgba(161, 161, 170, 0.22)' : 'rgba(47, 107, 255, 0.16)';

      // 1. Acoustic Sonar Cone / Seabed Rings at bottom (y = -0.78)
      const coneRing = [];
      for (let i = 0; i < 36; i++) {
        const a = (i / 36) * Math.PI * 2;
        coneRing.push({ x: Math.cos(a) * 0.72, y: -0.78, z: Math.sin(a) * 0.72 });
      }
      drawRing(coneRing, coneStroke, 1, true);

      // 2. Bounded Metric Hypersphere (radius = 0.62 -> tau boundary)
      const r = 0.62;
      const steps = 40;
      for (const lat of [-0.45, 0, 0.45]) {
        const ring = [];
        const rad = Math.cos(lat) * r;
        const y = Math.sin(lat) * r;
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          ring.push({ x: Math.cos(a) * rad, y, z: Math.sin(a) * rad });
        }
        drawRing(ring, lat === 0 ? tauStroke : sphereStroke, lat === 0 ? 1.4 : 0.9, lat !== 0);
      }

      for (const lon of [0, Math.PI / 2]) {
        const ring = [];
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          ring.push({
            x: Math.cos(a) * Math.cos(lon) * r,
            y: Math.sin(a) * r,
            z: Math.cos(a) * Math.sin(lon) * r,
          });
        }
        drawRing(ring, sphereStroke, 1);
      }

      // 3. Project & depth-sort 3D embedding points
      const projected = POINTS.map((p) => ({
        ...p,
        ...project(p.x, p.y, p.z),
      })).sort((a, b) => b.depth - a.depth);

      projected.forEach((pt) => {
        const alpha = Math.max(0.35, Math.min(1, 1 - pt.depth * 0.35));
        if (pt.type === 'unknown') {
          // Red anomaly outside bounded hypersphere
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 4.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 77, 46, ${alpha})`;
          ctx.fill();
          ctx.strokeStyle = isDark ? '#0D0D0D' : '#FFFFFF';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        } else if (pt.type === 'centroid') {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 199, 132, ${alpha})`;
          ctx.fill();
          ctx.strokeStyle = isDark ? '#FFFFFF' : '#0B0B0F';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 2.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(22, 199, 132, ${alpha * 0.72})`;
          ctx.fill();
        }
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onPointerDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      yaw += dx * 0.012;
      pitch = Math.max(-1.1, Math.min(1.1, pitch + dy * 0.012));
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onPointerUp = () => {
      dragging = false;
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [theme]);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-60 h-60 rounded-3xl bg-soft border border-line shadow-card flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-60 h-60 cursor-grab active:cursor-grabbing"
          aria-label="Interactive 3D metric hypersphere showing known sonar clusters inside boundary tau and unknown anomalies outside"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2 text-[10px] font-medium text-ink-muted pointer-events-none">
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-good" /> Known
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-bad" /> Unknown
          </span>
        </div>
        <div className="absolute bottom-2.5 right-3 text-[10px] font-mono text-ink-faint pointer-events-none">
          Drag to rotate 3D
        </div>
      </div>
      <div className="font-mono text-[11px] text-ink-muted mt-3 tracking-wide">
        128-D L2 HYPERSPHERE · BOUNDED RADIUS τ
      </div>
    </div>
  );
}
