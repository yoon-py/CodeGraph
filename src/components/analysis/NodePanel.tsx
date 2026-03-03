import { useState, useRef, useEffect } from 'react';
import { useAnalysisStore } from '../../store/analysisStore';
import { useChatStore } from '../../store/chatStore';
import { useAIStore } from '../../store/aiStore';
import { analysisNodes } from '../../data/analysis/nodes';
import { prChangeSet } from '../../data/analysis/changeset';
import { chatWithNode } from '../../services/aiChat';
import type { NodeContext } from '../../services/aiExplain';
import { RiskBadge } from './RiskBadge';
import { useT, useLangStore } from '../../i18n/index';

// ─── Shared sub-components ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 5, marginTop: 12 }}>
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

function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: 10, borderRadius: 3, background: 'var(--bg-hover)', width: i === lines - 1 ? '60%' : '100%', animation: 'shimmer 1.4s ease infinite' }} />
      ))}
    </div>
  );
}

function AISection({ icon, title, children, accent }: { icon: string; title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div style={{ marginBottom: 10, padding: '8px 10px', background: 'var(--bg-base)', border: `1px solid ${accent ? `${accent}33` : 'var(--border-subtle)'}`, borderLeft: `3px solid ${accent ?? 'var(--border-default)'}`, borderRadius: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent ?? 'var(--text-muted)' }}>
        <span>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

// ─── NodePanel ─────────────────────────────────────────────────────────────────

type TabId = 'inspector' | 'ai';

export function NodePanel() {
  const { selectedNodeId, setSelectedNodeId } = useAnalysisStore();
  const { lang } = useLangStore();
  const t = useT();
  const { cache, loading: aiLoading } = useAIStore();
  const { histories, addMessage, clearHistory } = useChatStore();

  const [activeTab, setActiveTab] = useState<TabId>('inspector');

  const node = selectedNodeId ? analysisNodes.find((n) => n.id === selectedNodeId) : null;

  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const cacheKey = node ? `${node.id}__${lang}` : '';
  const explanation = cacheKey ? cache[cacheKey] : null;
  const isAILoading = cacheKey ? aiLoading.has(cacheKey) : false;
  const chatHistory = node ? (histories[node.id] ?? []) : [];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory.length, chatSending]);

  async function handleSend() {
    if (!node || !chatInput.trim() || chatSending) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    addMessage(node.id, { role: 'user', content: userMsg });
    setChatSending(true);

    const ctx: NodeContext = {
      id: node.id,
      label: node.label,
      type: node.type,
      description: node.description,
      file: node.file,
      isNew: prChangeSet.newNodeIds.includes(node.id),
      isChanged: prChangeSet.changedNodeIds.includes(node.id),
      riskLevel: node.riskLevel ?? 'none',
      changeDescription: node.changeDescription,
      detail: node.detail,
    };

    try {
      const reply = await chatWithNode(node.id, ctx, chatHistory, userMsg, lang);
      addMessage(node.id, { role: 'assistant', content: reply });
    } catch (err) {
      addMessage(node.id, {
        role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      });
    } finally {
      setChatSending(false);
    }
  }

  const hasNode = !!node;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Fixed header ── */}
      <div style={{ flexShrink: 0, padding: '12px 14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
        {hasNode ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{node.label}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{node.type}</span>
                  {node.detail && <RiskBadge level={node.detail.riskLevel} />}
                </div>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1, padding: 2, background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
            {node.file && (
              <code style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-accent)', marginBottom: 8 }}>
                {node.file}
              </code>
            )}
            {node.changed && node.changeDescription && (
              <div style={{ padding: '5px 8px', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: 4, fontSize: 10, color: 'var(--risk-high)', marginBottom: 8 }}>
                {node.changeDescription}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 10, color: 'var(--text-muted)', fontSize: 12 }}>
            <span style={{ fontSize: 18 }}>◈</span>
            <span>{t.clickToView}</span>
          </div>
        )}

        {/* ── Tab buttons ── */}
        <div style={{ display: 'flex', gap: 2, marginTop: hasNode ? 4 : 0 }}>
          {(['inspector', 'ai'] as TabId[]).map((tab) => {
            const active = activeTab === tab;
            const label = tab === 'inspector' ? '◈ Inspector' : '✦ AI & Chat';
            return (
              <button
                key={tab}
                disabled={!hasNode}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '5px 12px',
                  fontSize: 10,
                  fontWeight: active ? 700 : 500,
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  color: active ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--text-accent)' : '2px solid transparent',
                  borderRadius: '4px 4px 0 0',
                  cursor: hasNode ? 'pointer' : 'default',
                  opacity: hasNode ? 1 : 0.4,
                  letterSpacing: '0.03em',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab content ── */}
      {!hasNode ? (
        <div style={{ flex: 1 }} />
      ) : activeTab === 'inspector' ? (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
          <InspectorTab node={node} t={t} />
        </div>
      ) : (
        <AITab
          node={node}
          t={t}
          explanation={explanation}
          isAILoading={isAILoading}
          chatHistory={chatHistory}
          chatInput={chatInput}
          setChatInput={setChatInput}
          chatSending={chatSending}
          onSend={handleSend}
          chatEndRef={chatEndRef}
          onClear={chatHistory.length > 0 ? () => clearHistory(node.id) : undefined}
        />
      )}

      <style>{`
        @keyframes shimmer { 0%{opacity:.4} 50%{opacity:.8} 100%{opacity:.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

// ─── Inspector tab ─────────────────────────────────────────────────────────────

function InspectorTab({ node, t }: { node: NonNullable<ReturnType<typeof analysisNodes.find>>; t: ReturnType<typeof useT> }) {
  const { detail } = node;
  if (!detail) return <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>No detail available.</p>;

  return (
    <>
      <SectionLabel>{t.summary}</SectionLabel>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 0 }}>{detail.summary}</p>

      <SectionLabel>{t.responsibilities}</SectionLabel>
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
          <SectionLabel>{t.dependsOn}</SectionLabel>
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
          <SectionLabel>{t.affectedBy}</SectionLabel>
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
          <SectionLabel>{t.apiRoutes}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {detail.apiRoutes.map((r) => <Tag key={r}>{r}</Tag>)}
          </div>
        </>
      )}

      {detail.dbTables && detail.dbTables.length > 0 && (
        <>
          <SectionLabel>{t.tables}</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {detail.dbTables.map((tb) => <Tag key={tb}>{tb}</Tag>)}
          </div>
        </>
      )}
    </>
  );
}

// ─── AI tab ────────────────────────────────────────────────────────────────────

interface AITabProps {
  node: NonNullable<ReturnType<typeof analysisNodes.find>>;
  t: ReturnType<typeof useT>;
  explanation: { whatItDoes: string; whyItMatters: string; whatMayBreak: string; recommendedTests: string[] } | null | undefined;
  isAILoading: boolean;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  chatInput: string;
  setChatInput: (v: string) => void;
  chatSending: boolean;
  onSend: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onClear: (() => void) | undefined;
}

function AITab({ node: _node, t, explanation, isAILoading, chatHistory, chatInput, setChatInput, chatSending, onSend, chatEndRef, onClear }: AITabProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* AI Analysis sections — scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {isAILoading && !explanation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[t.sectionWhatItDoes, t.sectionWhyMatters, t.sectionWhatBreaks, t.sectionTests].map((title) => (
              <AISection key={title} icon="·" title={title}>
                <Skeleton lines={2} />
              </AISection>
            ))}
          </div>
        )}

        {explanation && (
          <>
            <AISection icon="◈" title={t.sectionWhatItDoes} accent="#4f9cf9">
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{explanation.whatItDoes}</p>
            </AISection>
            <AISection icon="⬡" title={t.sectionWhyMatters} accent="#a855f7">
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{explanation.whyItMatters}</p>
            </AISection>
            <AISection icon="⚠" title={t.sectionWhatBreaks} accent="#f97316">
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{explanation.whatMayBreak}</p>
            </AISection>
            <AISection icon="✓" title={t.sectionTests} accent="#22c55e">
              <ul style={{ paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                {explanation.recommendedTests.map((test, i) => (
                  <li key={i} style={{ display: 'flex', gap: 7, fontSize: 11, color: 'var(--text-secondary)' }}>
                    <span style={{ flexShrink: 0, width: 16, height: 16, borderRadius: 3, background: 'rgba(34,197,94,0.15)', color: 'var(--risk-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, marginTop: 1 }}>
                      {i + 1}
                    </span>
                    <span style={{ lineHeight: 1.55 }}>{test}</span>
                  </li>
                ))}
              </ul>
            </AISection>
          </>
        )}

        {!isAILoading && !explanation && (
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 20 }}>
            AI analysis loading…
          </p>
        )}
      </div>

      {/* Chat box — fixed at bottom of AI tab */}
      <ChatBox
        disabled={false}
        chatInput={chatInput}
        setChatInput={setChatInput}
        chatSending={chatSending}
        chatHistory={chatHistory}
        onSend={onSend}
        chatEndRef={chatEndRef}
        onClear={onClear}
      />
    </div>
  );
}

// ─── ChatBox sub-component ─────────────────────────────────────────────────────

interface ChatBoxProps {
  disabled: boolean;
  chatInput: string;
  setChatInput: (v: string) => void;
  chatSending: boolean;
  chatHistory: { role: 'user' | 'assistant'; content: string }[];
  onSend: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
  onClear: (() => void) | undefined;
}

function ChatBox({ disabled, chatInput, setChatInput, chatSending, chatHistory, onSend, chatEndRef, onClear }: ChatBoxProps) {
  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <div style={{ borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px 2px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Ask AI</div>
        {onClear && (
          <button
            onClick={onClear}
            style={{ fontSize: 9, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', padding: '1px 4px' }}
          >
            clear
          </button>
        )}
      </div>

      {chatHistory.length > 0 && (
        <div style={{ maxHeight: 200, overflowY: 'auto', padding: '4px 10px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '85%',
                padding: '5px 9px',
                borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                background: msg.role === 'user' ? 'var(--text-accent)' : 'var(--bg-elevated)',
                border: msg.role === 'assistant' ? '1px solid var(--border-subtle)' : 'none',
                fontSize: 11,
                color: msg.role === 'user' ? '#fff' : 'var(--text-secondary)',
                lineHeight: 1.5,
                wordBreak: 'break-word',
              }}>
                {msg.content}
              </div>
            </div>
          ))}
          {chatSending && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '5px 9px', borderRadius: '10px 10px 10px 2px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', fontSize: 13, color: 'var(--text-muted)', letterSpacing: 2 }}>
                <span style={{ animation: 'shimmer 1.4s ease infinite', display: 'inline-block' }}>···</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 6, padding: '6px 10px 10px' }}>
        <textarea
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled || chatSending}
          placeholder={disabled ? 'Select a node to ask questions…' : 'Ask about this node… (Enter to send)'}
          rows={2}
          style={{
            flex: 1,
            resize: 'none',
            padding: '5px 8px',
            fontSize: 11,
            fontFamily: 'inherit',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-default)',
            borderRadius: 5,
            color: 'var(--text-primary)',
            outline: 'none',
            lineHeight: 1.4,
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <button
          onClick={onSend}
          disabled={disabled || chatSending || !chatInput.trim()}
          style={{
            padding: '6px 10px',
            fontSize: 11,
            fontWeight: 600,
            background: 'var(--text-accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: disabled || chatSending || !chatInput.trim() ? 'not-allowed' : 'pointer',
            opacity: disabled || chatSending || !chatInput.trim() ? 0.5 : 1,
            alignSelf: 'flex-end',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
