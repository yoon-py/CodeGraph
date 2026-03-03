export type PortSide = 'left' | 'right' | 'top' | 'bottom';

export interface Port {
  id: string;
  label: string;
  side: PortSide;
  type: 'input' | 'output';
}

export interface BlueprintNodeData extends Record<string, unknown> {
  label: string;
  sublabel?: string;
  file?: string;
  ports: Port[];
  isNew?: boolean;
  isModified?: boolean;
}

export interface FlowPath {
  id: string;
  name: string;
  description: string;
  nodeIds: string[];
  edgeIds: string[];
  color: string;
}
