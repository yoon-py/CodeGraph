import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { BlueprintNodeData } from '../../../types/blueprint';

export function AlertProcessorNode({ data }: NodeProps) {
  const d = data as unknown as BlueprintNodeData;
  return (
    <div className={`bp-node-card${d.isModified ? ' is-modified' : ''}`} style={{ borderTop: '2px solid var(--node-service)', minWidth: 170 }}>
      {d.isModified && (
        <div style={{ position: 'absolute', top: -10, right: 8, fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: 'var(--status-modified)', color: '#fff', textTransform: 'uppercase' }}>
          Modified
        </div>
      )}
      <Handle type="target" position={Position.Left} id="ap-in" />
      <div className="bp-node-header">
        <div className="bp-node-label">{d.label}</div>
        <div className="bp-node-sublabel">{d.sublabel}</div>
      </div>
      {d.file && (
        <div style={{ padding: '4px 10px', fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
          {d.file}
        </div>
      )}
      <Handle type="source" position={Position.Right} id="ap-out-push" style={{ top: '25%' }} />
      <Handle type="source" position={Position.Right} id="ap-out-email" style={{ top: '50%' }} />
      <Handle type="source" position={Position.Right} id="ap-out-sms" style={{ top: '75%' }} />
      <Handle type="source" position={Position.Bottom} id="ap-out-db" />
    </div>
  );
}
