import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function NotifierNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  const isNew = d.isNew;
  const isModified = d.isModified;

  // Determine handle IDs dynamically from ports
  const inputPorts = d.ports.filter((p) => p.type === 'input');
  const outputPorts = d.ports.filter((p) => p.type === 'output');

  // Find the bottom output (db write) and right output (api)
  const rightOutputs = outputPorts.filter((p) => p.side === 'right');
  const bottomOutputs = outputPorts.filter((p) => p.side === 'bottom');

  return (
    <div
      className={`bp-node-card${isNew ? ' is-new' : ''}${isModified ? ' is-modified' : ''}`}
      style={{ borderTop: `2px solid ${isNew ? 'var(--status-new)' : 'var(--node-service)'}`, minWidth: 160 }}
    >
      {isNew && (
        <div style={{ position: 'absolute', top: -10, right: 8, fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: 'var(--status-new)', color: '#fff', textTransform: 'uppercase' }}>
          New
        </div>
      )}

      {inputPorts.map((p) => (
        <Handle key={p.id} type="target" position={Position.Left} id={p.id} />
      ))}

      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>

      {d.file && (
        <div style={{ padding: '4px 10px', fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
          {d.file}
        </div>
      )}

      {rightOutputs.map((p) => (
        <Handle key={p.id} type="source" position={Position.Right} id={p.id} />
      ))}
      {bottomOutputs.map((p) => (
        <Handle key={p.id} type="source" position={Position.Bottom} id={p.id} />
      ))}
    </div>
  );
}
