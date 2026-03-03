import { SearchPanel } from '../components/analysis/SearchPanel';
import { FilterGroup } from '../components/analysis/FilterGroup';
import { FlowButtons } from '../components/analysis/FlowButtons';
import { GraphCanvas } from '../components/analysis/GraphCanvas';
import { NodePanel } from '../components/analysis/NodePanel';
import { useT } from '../i18n/index';

export function AnalysisView() {
  const t = useT();

  return (
    <div className="analysis-layout">
      <aside className="panel-left">
        <FlowButtons />
        <FilterGroup />
        <SearchPanel />
        <div className="panel-section" style={{ marginTop: 'auto' }}>
          <div className="panel-section-title">{t.legend}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <LegendItem color="var(--status-new)" label={t.legendNew} />
            <LegendItem color="var(--status-modified)" label={t.legendModified} />
            <LegendItem color="var(--status-unchanged)" label={t.legendUnchanged} />
          </div>
        </div>
      </aside>

      <main className="panel-center">
        <GraphCanvas />
      </main>

      <aside className="panel-right" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <NodePanel />
      </aside>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-secondary)' }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
      {label}
    </div>
  );
}
