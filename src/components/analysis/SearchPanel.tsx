import { useAnalysisStore } from '../../store/analysisStore';
import { prChangeSet } from '../../data/analysis/changeset';
import { useT } from '../../i18n/index';

export function SearchPanel() {
  const { filters, setSearchQuery, setShowChangedOnly, resetFilters } = useAnalysisStore();
  const t = useT();

  return (
    <div className="panel-section">
      <div className="panel-section-title">{t.search}</div>

      <input
        type="text"
        value={filters.searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t.searchPlaceholder}
        style={{
          width: '100%',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-default)',
          borderRadius: 4,
          padding: '6px 10px',
          fontSize: 12,
          color: 'var(--text-primary)',
          outline: 'none',
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--text-accent)'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
      />

      {/* PR info */}
      <div
        style={{
          marginTop: 12,
          padding: '8px 10px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 4,
        }}
      >
        <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          {t.activePR}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600, marginBottom: 2 }}>
          #{prChangeSet.prNumber} {prChangeSet.prTitle}
        </div>
        {prChangeSet.diffStats && (
          <div style={{ display: 'flex', gap: 8, fontSize: 10, color: 'var(--text-secondary)' }}>
            <span style={{ color: '#22c55e' }}>+{prChangeSet.diffStats.additions}</span>
            <span style={{ color: '#ef4444' }}>-{prChangeSet.diffStats.deletions}</span>
            <span>{prChangeSet.diffStats.filesChanged} {t.files}</span>
          </div>
        )}
      </div>

      <label
        style={{
          display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
          cursor: 'pointer', fontSize: 12, color: 'var(--text-secondary)',
        }}
      >
        <input
          type="checkbox"
          checked={filters.showChangedOnly}
          onChange={(e) => setShowChangedOnly(e.target.checked)}
          style={{ accentColor: 'var(--text-accent)' }}
        />
        {t.showChangedOnly}
      </label>

      <button
        onClick={resetFilters}
        style={{
          marginTop: 8, width: '100%', padding: '4px 0', fontSize: 10,
          color: 'var(--text-muted)', border: '1px solid var(--border-subtle)',
          borderRadius: 4, background: 'transparent', cursor: 'pointer', letterSpacing: '0.04em',
        }}
      >
        {t.resetFilters}
      </button>
    </div>
  );
}
