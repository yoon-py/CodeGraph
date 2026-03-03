import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function EventStoreNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  const isModified = d.isModified;

  return (
    <div
      className={`bp-node-card${isModified ? ' is-modified' : ''}`}
      style={{ borderTop: '2px solid var(--node-database)', minWidth: 140 }}
    >
      {isModified && (
        <div style={{ position: 'absolute', top: -10, right: 8, fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: 'var(--status-modified)', color: '#fff', textTransform: 'uppercase' }}>
          Modified
        </div>
      )}
      <Handle type="target" position={Position.Left} id={d.ports.find(p => p.side === 'left')?.id ?? 'in'} />
      <Handle type="target" position={Position.Top} id={d.ports.find(p => p.side === 'top')?.id ?? 'in-top'} />
      <Handle type="target" position={Position.Right} id={d.ports.find(p => p.side === 'right')?.id ?? 'in-right'} />
      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>
    </div>
  );
}
