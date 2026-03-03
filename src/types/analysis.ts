import type { NodeType, EdgeType, RiskLevel } from './graph';

export interface AnalysisFilters {
  searchQuery: string;
  nodeTypes: NodeType[];
  edgeTypes: EdgeType[];
  showChangedOnly: boolean;
  riskLevels: RiskLevel[];
}

export interface ChangeSet {
  prNumber: number;
  prTitle: string;
  prUrl?: string;
  changedNodeIds: string[];
  newNodeIds: string[];
  removedNodeIds: string[];
  diffStats?: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
}
