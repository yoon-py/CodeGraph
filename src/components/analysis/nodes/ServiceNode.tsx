import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../../types/graph';
import { RiskBadge } from '../RiskBadge';
import { useAnalysisStore } from '../../../store/analysisStore';

type ServiceNodeData = GraphNode & { isNew?: boolean; isChanged?: boolean };

export function ServiceNode({ data, selected }: NodeProps) {
  const d = data as unknown as ServiceNodeData;
  const { setSelectedNodeId } = useAnalysisStore();

  return (
    <div
      className={`node-card node-service${d.isNew ? ' is-new' : ''}${d.isChanged ? ' is-modified' : ''}${selected ? ' selected' : ''}`}
      onClick={() => setSelectedNodeId(d.id)}
    >
      <Handle type="target" position={Position.Left} />
      {d.isNew && <span className="node-change-badge new">New</span>}
      {d.isChanged && !d.isNew && <span className="node-change-badge modified">Modified</span>}
      <div className="node-header">
        <div className="node-type-icon">S</div>
        <span className="node-label">{d.label}</span>
      </div>
      {d.file && <code className="node-file">{d.file}</code>}
      {d.riskLevel && d.riskLevel !== 'none' && (
        <div style={{ marginTop: 4 }}><RiskBadge level={d.riskLevel} /></div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
