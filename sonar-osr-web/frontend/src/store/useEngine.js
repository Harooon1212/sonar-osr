import { create } from 'zustand';

export const useEngine = create((set) => ({
  status: 'checking', // 'checking' | 'online' | 'offline'
  device: null,
  modelLoaded: false,
  lastCheckedAt: null,
  lastLatencyMs: null,
  setHealth: (payload) =>
    set({
      status: payload?.status === 'online' ? 'online' : 'offline',
      device: payload?.device || null,
      modelLoaded: Boolean(payload?.model_loaded),
      lastCheckedAt: Date.now(),
    }),
  setLastLatencyMs: (ms) => set({ lastLatencyMs: ms }),
}));
