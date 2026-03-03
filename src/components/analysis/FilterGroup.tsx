import { useAnalysisStore } from '../../store/analysisStore';
import { useT } from '../../i18n/index';
import type { NodeType, EdgeType } from '../../types/graph';

function Chip({ label, color, active, onClick }: {
  label: string; color: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
        border: `1px solid ${active ? color : 'var(--border-subtle)'}`,
        background: active ? `${color}22` : 'transparent',
        color: active ? color : 'var(--text-muted)',
        cursor: 'pointer', transition: 'all var(--transition-fast)',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: active ? color : 'var(--border-default)', flexShrink: 0 }} />
      {label}
    </button>
  );
}

export function FilterGroup() {
  const { filters, toggleNodeType, toggleEdgeType } = useAnalysisStore();
  const t = useT();

  const NODE_TYPE_OPTIONS: { value: NodeType; label: string; color: string }[] = [
    { value: 'service',   label: t.nodeService,   color: 'var(--node-service)' },
    { value: 'external',  label: t.nodeExternal,  color: 'var(--node-external)' },
    { value: 'database',  label: t.nodeDatabase,  color: 'var(--node-database)' },
    { value: 'mobile',    label: t.nodeMobile,    color: 'var(--node-mobile)' },
    { value: 'scheduler', label: t.nodeScheduler, color: 'var(--node-scheduler)' },
  ];

  const EDGE_TYPE_OPTIONS: { value: EdgeType; label: string; color: string }[] = [
    { value: 'call',     label: t.edgeCall,     color: 'var(--edge-call)' },
    { value: 'data',     label: t.edgeData,     color: 'var(--edge-data)' },
    { value: 'event',    label: t.edgeEvent,    color: 'var(--edge-event)' },
    { value: 'schedule', label: t.edgeSchedule, color: 'var(--edge-schedule)' },
  ];

  return (
    <>
      <div className="panel-section">
        <div className="panel-section-title">{t.nodeTypes}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {NODE_TYPE_OPTIONS.map((opt) => (
            <Chip key={opt.value} label={opt.label} color={opt.color}
              active={filters.nodeTypes.includes(opt.value)}
              onClick={() => toggleNodeType(opt.value)} />
          ))}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-section-title">{t.edgeTypes}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {EDGE_TYPE_OPTIONS.map((opt) => (
            <Chip key={opt.value} label={opt.label} color={opt.color}
              active={filters.edgeTypes.includes(opt.value)}
              onClick={() => toggleEdgeType(opt.value)} />
          ))}
        </div>
      </div>
    </>
  );
}
