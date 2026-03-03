import { create } from 'zustand';

interface BlueprintState {
  selectedFlowId: string | null;
  setSelectedFlowId: (id: string | null) => void;
}

export const useBlueprintStore = create<BlueprintState>((set) => ({
  selectedFlowId: null,
  setSelectedFlowId: (id) => set({ selectedFlowId: id }),
}));
