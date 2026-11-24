import React from 'react';

/**
 * Backdrop Component — Section 2.4 of design.md
 * Fixed, full-viewport layer drawn once and never animated.
 * Supplies the refractive background (light pools, sonar range rings, subtle acoustic texture)
 * that gives the layered glassmorphic panels their authentic optical depth.
 */
export default function Backdrop() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: 'var(--bg-base)',
        overflow: 'hidden',
      }}
    >
      {/* 1. Light Pool Behind Hero (Radial Glow Cyan <=10% opacity, ~600px across) */}
      <div
        style={{
          position: 'absolute',
          top: '-150px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '640px',
          height: '640px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, rgba(13, 24, 41, 0) 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 2. Light Pool Behind Dashboard Header / Lower Grid */}
      <div
        style={{
          position: 'absolute',
          top: '420px',
          right: '5%',
          width: '580px',
          height: '580px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(96, 165, 250, 0.06) 0%, rgba(10, 15, 30, 0) 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 3. Faint Acoustic Sonar Range Rings in SVG (stroke: rgba(56, 189, 248, 0.06)) */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1400px',
          height: '900px',
          opacity: 0.85,
        }}
        viewBox="0 0 1400 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="700" cy="120" r="180" stroke="rgba(56, 189, 248, 0.05)" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx="700" cy="120" r="340" stroke="rgba(56, 189, 248, 0.04)" strokeWidth="1" />
        <circle cx="700" cy="120" r="520" stroke="rgba(56, 189, 248, 0.035)" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="700" cy="120" r="700" stroke="rgba(56, 189, 248, 0.025)" strokeWidth="1" />
        <line x1="180" y1="120" x2="1220" y2="120" stroke="rgba(56, 189, 248, 0.03)" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="700" y1="0" x2="700" y2="820" stroke="rgba(56, 189, 248, 0.03)" strokeWidth="1" strokeDasharray="2 4" />
      </svg>

      {/* 4. Subtle Acoustic Texture (6-8% opacity, darkened and blurred) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }}
      />
    </div>
  );
}
