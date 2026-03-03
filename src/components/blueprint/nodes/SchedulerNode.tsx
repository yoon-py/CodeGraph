import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function SchedulerNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  return (
    <div className="bp-node-card" style={{ borderTop: '2px solid var(--node-scheduler)', minWidth: 150 }}>
      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>
      <Handle type="source" position={Position.Right} id="sched-out" />
    </div>
  );
}
