import { create } from 'zustand';
import type { AnalysisFilters } from '../types/analysis';
import type { NodeType, EdgeType, RiskLevel } from '../types/graph';

const ALL_NODE_TYPES: NodeType[] = ['service', 'external', 'database', 'mobile', 'scheduler'];
const ALL_EDGE_TYPES: EdgeType[] = ['call', 'data', 'event', 'schedule'];
const ALL_RISK_LEVELS: RiskLevel[] = ['critical', 'high', 'medium', 'low', 'none'];

interface AnalysisState {
  filters: AnalysisFilters;
  selectedNodeId: string | null;
  selectedFlowId: string | null;

  setSearchQuery: (q: string) => void;
  toggleNodeType: (t: NodeType) => void;
  toggleEdgeType: (t: EdgeType) => void;
  toggleRiskLevel: (r: RiskLevel) => void;
  setShowChangedOnly: (v: boolean) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedFlowId: (id: string | null) => void;
  resetFilters: () => void;
}

const defaultFilters: AnalysisFilters = {
  searchQuery: '',
  nodeTypes: ALL_NODE_TYPES,
  edgeTypes: ALL_EDGE_TYPES,
  showChangedOnly: false,
  riskLevels: ALL_RISK_LEVELS,
};

export const useAnalysisStore = create<AnalysisState>((set) => ({
  filters: defaultFilters,
  selectedNodeId: null,
  selectedFlowId: null,

  setSearchQuery: (q) =>
    set((s) => ({ filters: { ...s.filters, searchQuery: q } })),

  toggleNodeType: (t) =>
    set((s) => ({
      filters: {
        ...s.filters,
        nodeTypes: s.filters.nodeTypes.includes(t)
          ? s.filters.nodeTypes.filter((x) => x !== t)
          : [...s.filters.nodeTypes, t],
      },
    })),

  toggleEdgeType: (t) =>
    set((s) => ({
      filters: {
        ...s.filters,
        edgeTypes: s.filters.edgeTypes.includes(t)
          ? s.filters.edgeTypes.filter((x) => x !== t)
          : [...s.filters.edgeTypes, t],
      },
    })),

  toggleRiskLevel: (r) =>
    set((s) => ({
      filters: {
        ...s.filters,
        riskLevels: s.filters.riskLevels.includes(r)
          ? s.filters.riskLevels.filter((x) => x !== r)
          : [...s.filters.riskLevels, r],
      },
    })),

  setShowChangedOnly: (v) =>
    set((s) => ({ filters: { ...s.filters, showChangedOnly: v } })),

  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setSelectedFlowId: (id) => set({ selectedFlowId: id }),

  resetFilters: () => set({ filters: defaultFilters }),
}));
