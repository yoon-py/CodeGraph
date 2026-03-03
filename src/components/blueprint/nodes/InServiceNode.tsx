import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function InServiceNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  return (
    <div className={`bp-node-card${d.isModified ? ' is-modified' : ''}`} style={{ borderTop: '2px solid var(--node-service)', minWidth: 160 }}>
      <Handle type="target" position={Position.Left} id="worker-in-http" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="worker-in-cron" style={{ top: '65%' }} />
      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>
      {d.file && (
        <div style={{ padding: '4px 10px', fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
          {d.file}
        </div>
      )}
      <Handle type="source" position={Position.Right} id="worker-out-processor" style={{ top: '35%' }} />
      <Handle type="source" position={Position.Bottom} id="worker-out-db" />
    </div>
  );
}
