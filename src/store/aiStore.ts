import { create } from 'zustand';
import type { AIExplanation } from '../services/aiExplain';

interface AIStoreState {
  cache: Record<string, AIExplanation>;  // key = `${nodeId}__${lang}`
  loading: Set<string>;                   // keys currently loading
  setExplanation: (key: string, exp: AIExplanation) => void;
  setLoading: (key: string, v: boolean) => void;
}

export const useAIStore = create<AIStoreState>((set) => ({
  cache: {},
  loading: new Set<string>(),

  setExplanation: (key, exp) =>
    set((s) => ({ cache: { ...s.cache, [key]: exp } })),

  setLoading: (key, v) =>
    set((s) => {
      const next = new Set(s.loading);
      v ? next.add(key) : next.delete(key);
      return { loading: next };
    }),
}));
