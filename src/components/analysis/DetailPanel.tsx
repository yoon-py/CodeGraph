import { useAnalysisStore } from '../../store/analysisStore';
import { analysisNodes } from '../../data/analysis/nodes';
import { RiskBadge } from './RiskBadge';
import { useT } from '../../i18n/index';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6, marginTop: 12 }}>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 3, fontSize: 10, fontFamily: 'var(--font-mono)', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', marginRight: 4, marginBottom: 4 }}>
      {children}
    </span>
  );
}

export function DetailPanel() {
  const { selectedNodeId, setSelectedNodeId } = useAnalysisStore();
  const t = useT();
  const node = selectedNodeId ? analysisNodes.find((n) => n.id === selectedNodeId) : null;

  if (!node) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center', gap: 8 }}>
        <div style={{ fontSize: 24 }}>◈</div>
        <div>{t.clickToView}</div>
      </div>
    );
  }

  const { detail } = node;

  return (
    <div style={{ padding: 'var(--sp-4)', overflowY: 'auto', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{node.label}</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{node.type}</div>
        </div>
        <button onClick={() => setSelectedNodeId(null)} style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1, padding: 2 }}>×</button>
      </div>

      {node.file && (
        <code style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-accent)', marginBottom: 8 }}>
          {node.file}
        </code>
      )}

      {node.changed && node.changeDescription && (
        <div style={{ padding: '6px 10px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 4, fontSize: 11, color: 'var(--risk-high)', marginBottom: 10 }}>
          {node.changeDescription}
        </div>
      )}

      {detail && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RiskBadge level={detail.riskLevel} />
          </div>

          <SectionTitle>{t.summary}</SectionTitle>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{detail.summary}</p>

          <SectionTitle>{t.responsibilities}</SectionTitle>
          <ul style={{ paddingLeft: 0 }}>
            {detail.responsibilities.map((r, i) => (
              <li key={i} style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', gap: 6, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>—</span>
                {r}
              </li>
            ))}
          </ul>

          {detail.dependsOn.length > 0 && (
            <>
              <SectionTitle>{t.dependsOn}</SectionTitle>
              {detail.dependsOn.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 2, border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>{d.edgeType}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{d.label}</span>
                </div>
              ))}
            </>
          )}

          {detail.affectedBy.length > 0 && (
            <>
              <SectionTitle>{t.affectedBy}</SectionTitle>
              {detail.affectedBy.map((d) => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, padding: '1px 4px', borderRadius: 2, border: '1px solid var(--border-subtle)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>{d.edgeType}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{d.label}</span>
                </div>
              ))}
            </>
          )}

          {detail.apiRoutes && detail.apiRoutes.length > 0 && (
            <>
              <SectionTitle>{t.apiRoutes}</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {detail.apiRoutes.map((r) => <Tag key={r}>{r}</Tag>)}
              </div>
            </>
          )}

          {detail.dbTables && detail.dbTables.length > 0 && (
            <>
              <SectionTitle>{t.tables}</SectionTitle>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {detail.dbTables.map((tb) => <Tag key={tb}>{tb}</Tag>)}
              </div>
            </>
          )}

          <SectionTitle>{t.potentialRisk}</SectionTitle>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{detail.potentialRisk}</p>
        </>
      )}
    </div>
  );
}
