export type NodeType = 'service' | 'external' | 'database' | 'mobile' | 'scheduler';
export type EdgeType = 'call' | 'data' | 'event' | 'schedule';
export type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

export interface DependencyRef {
  id: string;
  label: string;
  edgeType: EdgeType;
}

export interface NodeDetail {
  summary: string;
  responsibilities: string[];
  dependsOn: DependencyRef[];
  affectedBy: DependencyRef[];
  potentialRisk: string;
  riskLevel: RiskLevel;
  exports?: string[];      // future AST parser integration
  imports?: string[];
  apiRoutes?: string[];
  dbTables?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  file?: string;              // e.g., "workers.js:764" — AST integration point
  position: { x: number; y: number };
  detail?: NodeDetail;
  changed?: boolean;
  changeDescription?: string;
  riskLevel?: RiskLevel;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
  animated?: boolean;
}
