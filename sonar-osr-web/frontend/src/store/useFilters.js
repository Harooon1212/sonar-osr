import { create } from 'zustand';

export const ALL_METHOD_IDS = ['dml', 'svdd', 'msp'];

export const useFilters = create((set) => ({
  split: 'all', // 'all' | 'watertank' | 'turntable'
  methods: ['dml', 'svdd', 'msp'],
  classFilter: 'all', // 'all' | 'known' | 'unknown' | specific class
  setSplit: (split) => set({ split }),
  setMethods: (methods) =>
    set({
      methods: Array.isArray(methods) && methods.length > 0 ? methods : [],
    }),
  toggleMethod: (id) =>
    set((s) => {
      const exists = s.methods.includes(id);
      const next = exists ? s.methods.filter((m) => m !== id) : [...s.methods, id];
      return { methods: next };
    }),
  clearMethods: () => set({ methods: [] }),
  setClassFilter: (classFilter) => set({ classFilter }),
  hydrateFromSearch: (search) => {
    const params = new URLSearchParams(search);
    const split = params.get('split');
    const methodsParam = params.get('methods');
    const classParam = params.get('class');
    const patch = {};
    if (split && ['all', 'watertank', 'turntable'].includes(split)) {
      patch.split = split;
    }
    if (methodsParam !== null) {
      const list = methodsParam
        .split(',')
        .map((m) => m.trim())
        .filter((m) => ALL_METHOD_IDS.includes(m));
      patch.methods = list;
    }
    if (classParam) {
      patch.classFilter = classParam;
    }
    if (Object.keys(patch).length > 0) {
      set(patch);
    }
  },
}));
