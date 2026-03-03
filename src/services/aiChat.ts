/**
 * AI Chat service — OpenAI Chat Completions API
 *
 * Sends per-node multi-turn Q&A using selected node metadata as system context.
 * Falls back to canned mock replies when no API key is set.
 */

import type { NodeContext } from './aiExplain';
import type { Lang } from '../i18n/index';
import type { ChatMessage } from '../store/chatStore';

function buildSystemMessage(ctx: NodeContext, lang: Lang): string {
  const langInstruction =
    lang === 'ko' ? '반드시 한국어로만 응답하세요.' : 'Respond in English only.';
  const deps =
    ctx.detail?.dependsOn.map((d) => `${d.label} (${d.edgeType})`).join(', ') || 'none';
  const callers =
    ctx.detail?.affectedBy.map((d) => `${d.label} (${d.edgeType})`).join(', ') || 'none';

  return `You are a code review assistant analyzing a PR for the Alarm Safety Check-in System (Cloudflare Workers + D1 + Expo). ${langInstruction}

Node under discussion:
- ID: ${ctx.id}
- Label: ${ctx.label}
- Type: ${ctx.type}
- Description: ${ctx.description}
- File: ${ctx.file ?? 'unknown'}
- Status: ${ctx.isNew ? 'NEW' : ctx.isChanged ? 'MODIFIED' : 'UNCHANGED'}
- Risk Level: ${ctx.riskLevel}
- Change: ${ctx.changeDescription ?? 'none'}
- Depends On: ${deps}
- Called By: ${callers}${ctx.detail?.dbTables ? `\n- DB Tables: ${ctx.detail.dbTables.join(', ')}` : ''}${ctx.detail?.apiRoutes ? `\n- API Routes: ${ctx.detail.apiRoutes.join(', ')}` : ''}

Answer questions about this node concisely and accurately. Focus on practical code review insights.`;
}

// ─── Mock replies ──────────────────────────────────────────────────────────────

const MOCK_REPLIES_EN = [
  'Based on the node context, this component handles the core logic for its designated responsibility. The key risk factors are the upstream dependencies and how failures propagate through the call chain.',
  'Good question. Looking at this node\'s connections, I\'d focus on whether error boundaries exist between this component and its callers — a failure here could cascade.',
  'From a code review standpoint, I\'d verify the change description matches the actual diff, and check that all new code paths have corresponding test coverage.',
  'The interaction between this node and User DB (D1) is worth scrutinizing — especially write ordering and what happens on partial failures.',
];

const MOCK_REPLIES_KO = [
  '노드 컨텍스트를 기반으로, 이 컴포넌트는 Alarm 시스템에서 지정된 역할을 담당합니다. 업스트림 의존성과 오류 전파 방식이 주요 위험 요소입니다.',
  '좋은 질문입니다. 이 노드의 연결을 보면, 이 컴포넌트와 호출자 사이에 오류 경계가 있는지 확인하는 것이 중요합니다.',
  '코드 리뷰 관점에서, 변경 설명이 실제 diff와 일치하는지 확인하고 새로운 코드 경로에 대한 테스트 커버리지가 있는지 검토하겠습니다.',
  '이 노드와 User DB(D1) 간의 상호작용을 면밀히 검토하는 것이 중요합니다. 특히 쓰기 순서와 부분 실패 시 동작 방식을 확인하세요.',
];

// ─── Public API ────────────────────────────────────────────────────────────────

export async function chatWithNode(
  _nodeId: string,
  nodeCtx: NodeContext,
  history: ChatMessage[],
  userMessage: string,
  lang: Lang
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 700));
    const replies = lang === 'ko' ? MOCK_REPLIES_KO : MOCK_REPLIES_EN;
    return replies[history.length % replies.length];
  }

  const messages = [
    { role: 'system' as const, content: buildSystemMessage(nodeCtx, lang) },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user' as const, content: userMessage },
  ];

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 512,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI Chat API ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content ?? '';
}
