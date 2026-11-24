import { useEffect } from 'react';
import { checkBackendHealth } from '../lib/api';
import { useEngine } from '../store/useEngine';

export function useHealth(pollIntervalMs = 30000) {
  const setHealth = useEngine((s) => s.setHealth);

  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      const res = await checkBackendHealth();
      if (mounted) setHealth(res);
    };
    poll();
    const timer = setInterval(poll, pollIntervalMs);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [pollIntervalMs, setHealth]);
}
