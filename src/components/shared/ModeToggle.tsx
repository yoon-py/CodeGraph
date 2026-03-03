type Mode = 'analysis' | 'blueprint';

interface ModeToggleProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
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
      <ModeBtn label="Analysis" value="analysis" current={mode} onClick={onChange} />
      <ModeBtn label="Blueprint" value="blueprint" current={mode} onClick={onChange} />
    </div>
  );
}

function ModeBtn({
  label,
  value,
  current,
  onClick,
}: {
  label: string;
  value: Mode;
  current: Mode;
  onClick: (m: Mode) => void;
}) {
  const isActive = value === current;
  return (
    <button
      onClick={() => onClick(value)}
      style={{
        padding: '3px 12px',
        borderRadius: 3,
        fontSize: 11,
        fontWeight: isActive ? 700 : 400,
        background: isActive ? 'var(--bg-elevated)' : 'transparent',
        color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
        border: isActive ? '1px solid var(--border-default)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
      }}
    >
      {label}
    </button>
  );
}
