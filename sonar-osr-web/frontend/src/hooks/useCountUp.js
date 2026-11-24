import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useSettings } from '../store/useSettings';

export function useCountUp(target, durationMs = 600) {
  const prefersReduced = useReducedMotion();
  const settingReduced = useSettings((s) => s.reducedMotion);
  const skip = prefersReduced || settingReduced;

  const numericTarget = typeof target === 'number' && !Number.isNaN(target) ? target : null;
  const [value, setValue] = useState(numericTarget ?? 0);

  useEffect(() => {
    if (numericTarget === null) return;
    if (skip) {
      setValue(numericTarget);
      return;
    }

    let frameId = null;
    const startVal = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(startVal + (numericTarget - startVal) * eased);
      if (t < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
    };
  }, [numericTarget, durationMs, skip]);

  return numericTarget === null ? null : value;
}
