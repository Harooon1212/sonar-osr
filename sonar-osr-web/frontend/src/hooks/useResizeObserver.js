import { useEffect, useState } from 'react';

export function useResizeObserver(ref) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref?.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}
