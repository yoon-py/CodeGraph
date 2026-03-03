import { useLangStore } from '../../i18n/index';

export function Toolbar() {
  const { lang, setLang } = useLangStore();

  return (
    <header className="toolbar">
      <div className="toolbar-brand">
        <div className="toolbar-brand-dot" />
        CodeGraph
      </div>

      <span
        style={{
          fontSize: 10,
          color: 'var(--text-muted)',
          borderLeft: '1px solid var(--border-subtle)',
          paddingLeft: 12,
          letterSpacing: '0.04em',
        }}
      >
        Alarm / PR #42
      </span>

      <div className="toolbar-sep" />

      {/* Language toggle */}
      <div
        style={{
          display: 'flex',
          background: 'var(--bg-base)',
          border: '1px solid var(--border-default)',
          borderRadius: 5,
          padding: 2,
          gap: 2,
        }}
      >
        {(['en', 'ko'] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            style={{
              padding: '2px 10px',
              borderRadius: 3,
              fontSize: 11,
              fontWeight: lang === l ? 700 : 400,
              background: lang === l ? 'var(--bg-elevated)' : 'transparent',
              color: lang === l ? 'var(--text-primary)' : 'var(--text-muted)',
              border: lang === l ? '1px solid var(--border-default)' : '1px solid transparent',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              letterSpacing: l === 'ko' ? '0.02em' : undefined,
            }}
          >
            {l === 'en' ? 'EN' : '한국어'}
          </button>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 10,
          color: 'var(--text-muted)',
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#22c55e',
          }}
        />
        12 nodes · 14 edges
      </div>
    </header>
  );
}
