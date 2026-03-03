import { flowPaths } from '../../data/blueprint/flows';
import { useBlueprintStore } from '../../store/blueprintStore';
import { useT } from '../../i18n/index';

export function FlowSelector() {
  const { selectedFlowId, setSelectedFlowId } = useBlueprintStore();
  const t = useT();

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, flexShrink: 0 }}>
        {t.flowLabel}
      </span>

      <button
        onClick={() => setSelectedFlowId(null)}
        style={{
          padding: '3px 10px',
          borderRadius: 4,
          fontSize: 11,
          fontWeight: selectedFlowId === null ? 700 : 400,
          border: `1px solid ${selectedFlowId === null ? 'var(--text-accent)' : 'var(--border-subtle)'}`,
          background: selectedFlowId === null ? 'rgba(79,156,249,0.12)' : 'transparent',
          color: selectedFlowId === null ? 'var(--text-accent)' : 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)',
        }}
      >
        {t.flowAll}
      </button>

      {flowPaths.map((flow) => {
        const isActive = selectedFlowId === flow.id;
        return (
          <button
            key={flow.id}
            onClick={() => setSelectedFlowId(isActive ? null : flow.id)}
            title={flow.description}
            style={{
              padding: '3px 10px',
              borderRadius: 4,
              fontSize: 11,
              fontWeight: isActive ? 700 : 400,
              border: `1px solid ${isActive ? flow.color : 'var(--border-subtle)'}`,
              background: isActive ? `${flow.color}22` : 'transparent',
              color: isActive ? flow.color : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: flow.color, flexShrink: 0 }} />
            {flow.name}
          </button>
        );
      })}
    </div>
  );
}
