import React, { useState } from 'react';
import { MoveHorizontal } from 'lucide-react';

export default function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Original',
  afterLabel = 'Processed',
  height = 240,
}) {
  const [pos, setPos] = useState(50);

  return (
    <div className="space-y-2">
      <div
        className="relative w-full overflow-hidden rounded-control border border-line bg-[#0B1120] select-none"
        style={{ height }}
      >
        <img
          src={afterSrc}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={beforeLabel}
            className="w-full h-full object-contain"
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.6)] pointer-events-none"
          style={{ left: `${pos}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-ink shadow-md flex items-center justify-center">
            <MoveHorizontal size={14} />
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-medium">
          {beforeLabel}
        </span>
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-primary/90 text-white text-[11px] font-medium">
          {afterLabel}
        </span>

        {/* Invisible range input for smooth keyboard & pointer dragging */}
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${beforeLabel} and ${afterLabel}`}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>
    </div>
  );
}
