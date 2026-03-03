import { analysisFlows } from '../../data/analysis/flows';
import { useAnalysisStore } from '../../store/analysisStore';

export function FlowButtons() {
  const { selectedFlowId, setSelectedFlowId } = useAnalysisStore();

  return (
    <div className="panel-section">
      <div className="panel-section-title">FLOWS</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {analysisFlows.map((flow) => {
          const active = selectedFlowId === flow.id;
          return (
            <button
              key={flow.id}
              title={flow.description}
              onClick={() => setSelectedFlowId(active ? null : flow.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 4,
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                background: active ? `${flow.color}18` : 'var(--bg-base)',
                border: `1px solid ${active ? flow.color : 'var(--border-default)'}`,
                color: active ? flow.color : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                letterSpacing: '0.02em',
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: flow.color,
                  flexShrink: 0,
                  opacity: active ? 1 : 0.6,
                }}
              />
              {flow.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
