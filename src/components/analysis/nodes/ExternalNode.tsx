import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { GraphNode } from '../../../types/graph';
import { useAnalysisStore } from '../../../store/analysisStore';

export function ExternalNode({ data, selected }: NodeProps) {
  const d = data as unknown as GraphNode;
  const { setSelectedNodeId } = useAnalysisStore();

  return (
    <div
      className={`node-card node-external${selected ? ' selected' : ''}`}
      onClick={() => setSelectedNodeId(d.id)}
    >
      <Handle type="target" position={Position.Left} />
      <div className="node-header">
        <div className="node-type-icon">E</div>
        <span className="node-label">{d.label}</span>
      </div>
      {d.file && <code className="node-file">{d.file}</code>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
