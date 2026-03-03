import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function MobileBpNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  return (
    <div className="bp-node-card" style={{ borderTop: '2px solid var(--node-mobile)', minWidth: 150 }}>
      <Handle type="target" position={Position.Left} id="mobile-in-push" />
      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>
      <Handle type="source" position={Position.Right} id="mobile-out-api" />
    </div>
  );
}
