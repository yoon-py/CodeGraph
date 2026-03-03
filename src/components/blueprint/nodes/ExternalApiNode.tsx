import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function ExternalApiNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  const bottomPorts = d.ports.filter((p) => p.side === 'bottom');

  return (
    <div className="bp-node-card" style={{ borderTop: '2px solid var(--node-external)', minWidth: 150 }}>
      <Handle
        type="target"
        position={Position.Left}
        id={d.ports.find((p) => p.side === 'left')?.id ?? 'in'}
      />
      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>
      {bottomPorts.map((p) => (
        <Handle key={p.id} type="source" position={Position.Bottom} id={p.id} />
      ))}
    </div>
  );
}
