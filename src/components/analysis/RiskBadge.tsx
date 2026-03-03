import type { RiskLevel } from '../../types/graph';

interface RiskBadgeProps {
  level: RiskLevel;
}

const LABELS: Record<RiskLevel, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'None',
};

export function RiskBadge({ level }: RiskBadgeProps) {
  if (level === 'none') return null;
  return (
    <span className={`risk-badge ${level}`}>
      {LABELS[level]}
    </span>
  );
}
