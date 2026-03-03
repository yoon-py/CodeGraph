export function Legend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
      <LegendEdge label="Call" style={{ stroke: 'var(--edge-call)' }} dashed={false} />
      <LegendEdge label="Data" style={{ stroke: 'var(--edge-data)' }} dashed />
      <LegendEdge label="Schedule" style={{ stroke: 'var(--edge-schedule)' }} dashed={false} />
      <LegendNode color="var(--status-new)" label="New" />
      <LegendNode color="var(--status-modified)" label="Modified" />
    </div>
  );
}

function LegendEdge({ label, style, dashed }: { label: string; style: React.CSSProperties; dashed: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}>
      <svg width="24" height="10" viewBox="0 0 24 10">
        <line
          x1="0" y1="5" x2="24" y2="5"
          stroke={style.stroke as string}
          strokeWidth="1.5"
          strokeDasharray={dashed ? '4 2' : undefined}
        />
      </svg>
      {label}
    </div>
  );
}

function LegendNode({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--text-muted)' }}>
      <span style={{ width: 10, height: 10, borderRadius: 2, background: color, flexShrink: 0 }} />
      {label}
    </div>
  );
}
