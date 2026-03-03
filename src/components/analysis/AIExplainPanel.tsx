import { useState, useEffect, useRef } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { analysisNodes } from '../../data/analysis/nodes';
import { prChangeSet } from '../../data/analysis/changeset';
import { explainNode } from '../../services/aiExplain';
import type { AIExplanation, NodeContext } from '../../services/aiExplain';
import { useT, useLangStore } from '../../i18n/index';

function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 11, borderRadius: 3, background: 'var(--bg-hover)', width: i === lines - 1 ? '60%' : '100%', animation: 'shimmer 1.4s ease infinite' }} />
      ))}
    </div>
  );
}

function Section({ icon, title, children, accent }: { icon: string; title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ marginBottom: 16, padding: '10px 12px', background: 'var(--bg-base)', border: `1px solid ${accent ? `${accent}33` : 'var(--border-subtle)'}`, borderLeft: `3px solid ${accent ?? 'var(--border-default)'}`, borderRadius: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent ?? 'var(--text-muted)' }}>
        <span>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

export function AIExplainPanel() {
  const { selectedNodeId } = useAnalysisStore();
  const { lang } = useLangStore();
  const t = useT();
  const node = selectedNodeId ? analysisNodes.find((n) => n.id === selectedNodeId) : null;

  const [explanation, setExplanation] = useState<AIExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedMock, setUsedMock] = useState(false);
  const lastKey = useRef<string | null>(null);

  // Re-fetch when node OR language changes
  useEffect(() => {
    if (!node) { setExplanation(null); setError(null); lastKey.current = null; return; }
    const key = `${node.id}__${lang}`;
    if (key === lastKey.current) return;
    lastKey.current = key;
    setExplanation(null); setError(null);
    fetchExplanation(node.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node?.id, lang]);

  async function fetchExplanation(nodeId: string) {
    const n = analysisNodes.find((x) => x.id === nodeId);
    if (!n) return;
    const ctx: NodeContext = {
      id: n.id, label: n.label, type: n.type, description: n.description,
      file: n.file, isNew: prChangeSet.newNodeIds.includes(n.id),
      isChanged: prChangeSet.changedNodeIds.includes(n.id),
      riskLevel: n.riskLevel ?? 'none', changeDescription: n.changeDescription, detail: n.detail,
    };
    const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY);
    setUsedMock(!hasApiKey);
    setLoading(true);
    const key = `${nodeId}__${lang}`;
    try {
      const result = await explainNode(ctx, lang);
      if (lastKey.current === key) setExplanation(result);
    } catch (e) {
      if (lastKey.current === key) setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      if (lastKey.current === key) setLoading(false);
    }
  }

  if (!node) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20, textAlign: 'center', gap: 8 }}>
        <div style={{ fontSize: 24 }}>✦</div>
        <div>{t.clickToExplain}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '12px 14px', overflowY: 'auto', flex: 1 }}>
      {/* Node header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 4, background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>✦</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{node.label}</div>
          {node.file && <code style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--text-accent)' }}>{node.file}</code>}
        </div>
        <button
          onClick={() => fetchExplanation(node.id)}
          disabled={loading}
          style={{ marginLeft: 'auto', padding: '3px 8px', borderRadius: 4, fontSize: 10, border: '1px solid var(--border-default)', background: 'transparent', color: loading ? 'var(--text-muted)' : 'var(--text-secondary)', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>↻</span>
          {loading ? t.analyzing : t.regenerate}
        </button>
      </div>

      {/* Source badge */}
      {!loading && explanation && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, padding: '2px 7px', borderRadius: 3, marginBottom: 12, background: usedMock ? 'rgba(234,179,8,0.12)' : 'rgba(79,156,249,0.12)', border: `1px solid ${usedMock ? 'rgba(234,179,8,0.3)' : 'rgba(79,156,249,0.3)'}`, color: usedMock ? 'var(--risk-medium)' : 'var(--text-accent)', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          <span>{usedMock ? '⚡' : '✦'}</span>
          {usedMock ? t.mockBadge : t.aiBadge}
        </div>
      )}

      {error && (
        <div style={{ padding: '8px 10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 4, fontSize: 11, color: 'var(--risk-critical)', marginBottom: 12 }}>
          {t.apiError}: {error}
        </div>
      )}

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[t.sectionWhatItDoes, t.sectionWhyMatters, t.sectionWhatBreaks, t.sectionTests].map((title) => (
            <Section key={title} icon="·" title={title}><Skeleton lines={3} /></Section>
          ))}
        </div>
      )}

      {!loading && explanation && (
        <>
          <Section icon="◈" title={t.sectionWhatItDoes} accent="#4f9cf9">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{explanation.whatItDoes}</p>
          </Section>
          <Section icon="⬡" title={t.sectionWhyMatters} accent="#a855f7">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{explanation.whyItMatters}</p>
          </Section>
          <Section icon="⚠" title={t.sectionWhatBreaks} accent="#f97316">
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{explanation.whatMayBreak}</p>
          </Section>
          <Section icon="✓" title={t.sectionTests} accent="#22c55e">
            <ul style={{ paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {explanation.recommendedTests.map((test, i) => (
                <li key={i} style={{ display: 'flex', gap: 7, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span style={{ flexShrink: 0, width: 16, height: 16, borderRadius: 3, background: 'rgba(34,197,94,0.15)', color: 'var(--risk-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, marginTop: 1 }}>{i + 1}</span>
                  <span style={{ lineHeight: 1.55 }}>{test}</span>
                </li>
              ))}
            </ul>
          </Section>
        </>
      )}

      <style>{`
        @keyframes shimmer { 0%{opacity:.4} 50%{opacity:.8} 100%{opacity:.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
