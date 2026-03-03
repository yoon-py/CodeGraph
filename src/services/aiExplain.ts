/**
 * AI Explain service — OpenAI Responses API layer
 *
 * - VITE_OPENAI_API_KEY 환경변수가 있으면 실제 API 호출
 * - 없거나 오류 시 mock 응답으로 폴백
 * - lang 파라미터로 한국어/영어 응답 전환
 *
 * ⚠️  프론트엔드에서 직접 API 키를 사용하는 구조는 프로토타입 전용입니다.
 *     프로덕션에서는 BFF(Backend-for-Frontend) 프록시 서버를 통해 호출하세요.
 */

import type { NodeType, RiskLevel, NodeDetail } from '../types/graph';
import type { Lang } from '../i18n/index';

export interface NodeContext {
  id: string;
  label: string;
  type: NodeType;
  description: string;
  file?: string;
  isNew: boolean;
  isChanged: boolean;
  riskLevel: RiskLevel;
  changeDescription?: string;
  detail?: NodeDetail;
}

export interface AIExplanation {
  whatItDoes: string;
  whyItMatters: string;
  whatMayBreak: string;
  recommendedTests: string[];
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildSystemPrompt(lang: Lang): string {
  const langInstruction = lang === 'ko' ? '반드시 한국어로만 응답하세요.' : 'Respond in English only.';
  return `You are a senior software architect reviewing a pull request. You analyze nodes in a code dependency graph and provide concise, actionable insights. Always respond with valid JSON only — no markdown fences, no extra text. ${langInstruction}`;
}

function buildUserPrompt(ctx: NodeContext): string {
  const deps = ctx.detail?.dependsOn.map((d) => `${d.label} (${d.edgeType})`).join(', ') || 'none';
  const callers = ctx.detail?.affectedBy.map((d) => `${d.label} (${d.edgeType})`).join(', ') || 'none';

  return `Context: PR #42 — "feat: Add Expo Push Reminder for overdue check-ins" in the Alarm Safety Check-in System (Cloudflare Workers + D1 + Expo).

Analyze this architecture node:
${JSON.stringify({ id: ctx.id, label: ctx.label, type: ctx.type, description: ctx.description, file: ctx.file ?? null, status: ctx.isNew ? 'NEW' : ctx.isChanged ? 'MODIFIED' : 'UNCHANGED', riskLevel: ctx.riskLevel, changeDescription: ctx.changeDescription ?? null, dependsOn: deps, calledBy: callers, dbTables: ctx.detail?.dbTables?.join(', ') ?? null, apiRoutes: ctx.detail?.apiRoutes?.join(', ') ?? null }, null, 2)}

Respond with this exact JSON structure:
{
  "whatItDoes": "2–3 sentences.",
  "whyItMatters": "2–3 sentences.",
  "whatMayBreak": "2–3 sentences.",
  "recommendedTests": ["test 1", "test 2", "test 3", "test 4"]
}`;
}

// ─── OpenAI Responses API call ────────────────────────────────────────────────

async function callOpenAI(ctx: NodeContext, lang: Lang): Promise<AIExplanation> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error('VITE_OPENAI_API_KEY is not set');

  const res = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: buildSystemPrompt(lang) },
        { role: 'user', content: buildUserPrompt(ctx) },
      ],
    }),
  });

  if (!res.ok) throw new Error(`OpenAI Responses API ${res.status}: ${await res.text()}`);

  const data = (await res.json()) as {
    output: Array<{ content: Array<{ type: string; text: string }> }>;
  };

  const rawText = data.output?.[0]?.content?.[0]?.text ?? '';
  return JSON.parse(rawText) as AIExplanation;
}

// ─── Mock responses (English) ─────────────────────────────────────────────────

const MOCK_EN: Record<string, AIExplanation> = {
  pushReminder: {
    whatItDoes: 'sendPushReminders() (workers.js:907) fetches Expo push tokens for overdue users from the D1 User DB and sends batch push notifications via Expo Push API. On success it increments the push_reminders_sent counter per user.',
    whyItMatters: 'This is the new mobile alert channel introduced in PR #42 — the only way overdue users receive a push notification on their device. It also writes state back to User DB, making it a write-path actor.',
    whatMayBreak: 'Stale or revoked push tokens cause silent delivery failures unless ExpoPushErrorReceipt is explicitly handled. The push_reminders_sent D1 write can race if cron fires twice. No retry logic means transient Expo API outages silently drop notifications.',
    recommendedTests: ['Unit: sendPushReminders() exits early when no overdue users exist', 'Unit: ExpoPushError receipt triggers token removal from push_tokens table', 'Integration: AlertProcessor → PushReminder → mock Expo server round-trip delivers correct payload', 'Load: 500 simultaneous overdue users — D1 write batching completes within Worker CPU limit'],
  },
  alertProcessor: {
    whatItDoes: 'processDueAlerts() (workers.js:764) queries the User DB for check-ins overdue beyond their window, then fans out in parallel to EmailNotifier, SMSNotifier, and the new PushReminder. Results are appended as events to the Event Store.',
    whyItMatters: 'This is the single orchestration point for all alert dispatching. PR #42 added PushReminder as a third fan-out target, expanding blast radius and increasing total latency per cron execution.',
    whatMayBreak: 'An uncaught exception inside PushReminder could abort the fan-out loop, leaving email/SMS unsent. Cron execution time increases with Expo API latency. Partial failure has no reconciliation path today.',
    recommendedTests: ['Unit: PushReminder failure does not prevent EmailNotifier/SMSNotifier execution', 'Unit: processDueAlerts() invokes PushReminder exactly once per overdue user batch', 'Integration: full cron with mocked D1 returns correct event count in Event Store', 'Regression: email/SMS dispatch payloads unchanged before and after PR #42'],
  },
  userDb: {
    whatItDoes: 'Cloudflare D1 SQLite database storing user profiles, check-in history, alert preferences, and push tokens. PR #42 adds a nullable INTEGER column push_reminders_sent to the users table via schema migration.',
    whyItMatters: 'This column is the only durable record of how many push reminders a user has received — required for future rate-limiting. Being globally replicated D1, the migration propagates to all edge locations automatically.',
    whatMayBreak: 'SELECT * queries assuming a fixed column count may behave unexpectedly post-migration. Rollback requires an explicit DROP COLUMN migration. High-frequency increments could hit D1 write throughput limits under large batches.',
    recommendedTests: ['Migration: push_reminders_sent column exists with correct type after migration', 'Backward-compat: existing rows return NULL (not error) for push_reminders_sent', 'Update: PushReminder correctly increments from NULL and integer values', 'Rollback: DROP COLUMN migration completes without corrupting existing user data'],
  },
  worker: {
    whatItDoes: 'The Cloudflare Workers fetch handler (workers.js:1) is the entry point for all HTTP requests and cron events. It performs JWT auth via Clerk, routes API calls, and delegates scheduled events to AlertProcessor.',
    whyItMatters: 'Central routing failure takes down the entire service. It holds all environment bindings (D1, secrets) that downstream modules depend on.',
    whatMayBreak: 'Any change to routing or auth middleware breaks all API consumers. New environment bindings require deployment + wrangler.toml update. Cold start time increases with each new top-level import.',
    recommendedTests: ['Auth: request without Clerk JWT returns 401', 'Routing: POST /api/checkin delegates to correct handler', 'Cron: scheduled event triggers processDueAlerts() with correct env bindings', 'Health: GET /api/health returns 200 within 50ms'],
  },
};

// ─── Mock responses (Korean) ──────────────────────────────────────────────────

const MOCK_KO: Record<string, AIExplanation> = {
  pushReminder: {
    whatItDoes: 'sendPushReminders()(workers.js:907)는 D1 User DB에서 기한 초과 사용자의 Expo 푸시 토큰을 조회하고 Expo Push API를 통해 배치 알림을 발송합니다. 성공 시 사용자별 push_reminders_sent 카운터를 증가시킵니다.',
    whyItMatters: 'PR #42에서 새로 추가된 모바일 알림 채널의 핵심 진입점입니다. 이 노드 없이는 기한 초과 사용자가 기기에서 푸시 알림을 받을 수 없습니다. User DB에 쓰기를 수행하므로 쓰기 경로의 행위자이기도 합니다.',
    whatMayBreak: '만료된 토큰은 ExpoPushErrorReceipt를 명시적으로 처리하지 않으면 무음 실패가 됩니다. 크론이 두 번 실행되면 push_reminders_sent D1 쓰기 충돌이 발생할 수 있습니다. 재시도 로직이 없어 Expo API 일시 장애 시 알림이 조용히 누락됩니다.',
    recommendedTests: ['단위: 기한 초과 사용자가 없으면 sendPushReminders()가 조기 종료됨', '단위: ExpoPushError 수신 시 push_tokens 테이블에서 해당 토큰 삭제', '통합: AlertProcessor → PushReminder → 목 Expo 서버 왕복 시 올바른 페이로드 전달 확인', '부하: 500명 동시 기한 초과 사용자 시 D1 배치 쓰기가 Workers CPU 제한 내 완료'],
  },
  alertProcessor: {
    whatItDoes: 'processDueAlerts()(workers.js:764)는 User DB에서 체크인 기한 초과 사용자를 조회하고 EmailNotifier, SMSNotifier, 신규 PushReminder로 병렬 팬아웃합니다. 각 결과는 Event Store에 이벤트로 추가됩니다.',
    whyItMatters: '모든 알림 발송의 단일 오케스트레이션 지점으로, 크론 틱마다 기한 초과 사용자 전체가 여기를 통과합니다. PR #42는 PushReminder를 세 번째 팬아웃 대상으로 추가해 실행 범위와 전체 레이턴시를 증가시켰습니다.',
    whatMayBreak: 'PushReminder 내 미처리 예외가 팬아웃 루프를 중단시켜 이메일/SMS가 발송되지 않을 수 있습니다. Expo API 레이턴시에 비례해 크론 실행 시간이 증가합니다. 부분 실패(이메일 성공, 푸시 실패)를 조정하는 경로가 현재 없습니다.',
    recommendedTests: ['단위: PushReminder 실패 시 EmailNotifier, SMSNotifier는 계속 실행됨', '단위: processDueAlerts()가 기한 초과 사용자 배치당 PushReminder를 정확히 한 번 호출', '통합: 목 D1과 알림 모듈로 전체 크론 실행 시 Event Store에 올바른 이벤트 수 반환', '회귀: PR #42 전후 이메일/SMS 디스패치 페이로드가 동일'],
  },
  userDb: {
    whatItDoes: 'Cloudflare D1 SQLite 데이터베이스로 사용자 프로필, 체크인 기록, 알림 설정, 푸시 토큰을 저장합니다. PR #42는 스키마 마이그레이션으로 users 테이블에 nullable INTEGER 컬럼 push_reminders_sent를 추가합니다.',
    whyItMatters: '이 컬럼은 사용자가 받은 푸시 알림 횟수를 기록하는 유일한 영속적 데이터로, 향후 속도 제한 로직에 필수입니다. D1은 전 세계 엣지로 자동 복제되므로 마이그레이션은 모든 엣지 위치에 전파됩니다.',
    whatMayBreak: '고정 컬럼 수를 가정하는 SELECT * 쿼리는 마이그레이션 후 예상과 다르게 동작할 수 있습니다. 롤백 시 명시적 DROP COLUMN 마이그레이션이 필요하며 데이터 복구가 불가합니다. 대규모 배치의 빈번한 증가 연산이 D1 쓰기 처리량 한계에 도달할 수 있습니다.',
    recommendedTests: ['마이그레이션: 실행 후 push_reminders_sent 컬럼이 올바른 타입으로 존재', '하위 호환성: 첫 푸시 전 기존 행에서 push_reminders_sent가 오류 없이 NULL 반환', '업데이트: PushReminder가 NULL과 정수 값 모두에서 카운터를 올바르게 증가', '롤백: DROP COLUMN 완료 시 기존 사용자 데이터 손상 없음'],
  },
  worker: {
    whatItDoes: 'Cloudflare Workers fetch 핸들러(workers.js:1)는 모든 HTTP 요청과 크론 이벤트의 진입점입니다. Clerk JWT 인증을 수행하고 API 호출을 라우팅하며 스케줄 이벤트를 AlertProcessor에 위임합니다.',
    whyItMatters: '중앙 라우팅 실패 시 전체 서비스가 중단됩니다. 하위 모듈이 의존하는 모든 환경 바인딩(D1, 시크릿)을 보유합니다.',
    whatMayBreak: '라우팅이나 인증 미들웨어 변경 시 모든 API 소비자가 영향을 받습니다. 새 환경 바인딩 추가 시 배포와 wrangler.toml 업데이트가 필요합니다.',
    recommendedTests: ['인증: Clerk JWT 없는 요청은 401 반환', '라우팅: POST /api/checkin이 올바른 핸들러로 위임됨', '크론: 스케줄 이벤트가 올바른 env 바인딩으로 processDueAlerts() 실행', '헬스: GET /api/health가 50ms 이내 200 반환'],
  },
};

function generateGenericMock(ctx: NodeContext, lang: Lang): AIExplanation {
  const deps = ctx.detail?.dependsOn.map((d) => d.label).join(', ') || (lang === 'ko' ? '없음' : 'none');
  const callers = ctx.detail?.affectedBy.map((d) => d.label).join(', ') || (lang === 'ko' ? '없음' : 'none');

  if (lang === 'ko') {
    const statusText = ctx.isNew ? 'PR에서 새로 추가되었습니다.' : ctx.isChanged ? 'PR에서 수정되었습니다.' : 'PR에서 변경되지 않았으나 연결 노드에 영향받습니다.';
    return {
      whatItDoes: `${ctx.label}는 ${ctx.type} 타입 노드입니다. ${ctx.description} 위치: ${ctx.file ?? '알 수 없음'}.`,
      whyItMatters: `[${callers}]에 의해 호출되고 [${deps}]에 의존합니다. ${statusText} 위험 수준: ${ctx.riskLevel}.`,
      whatMayBreak: `${ctx.label} 변경 시 [${callers}]에 직접 영향을 줍니다. [${deps}] 의존성 오류가 이 노드에서 먼저 나타납니다.`,
      recommendedTests: ['단위: 정상 동작 시나리오 검증', '단위: 업스트림 의존성 불가용 시 안전한 기본값 반환', `통합: ${ctx.label}를 통한 엔드투엔드 흐름 검증`, '회귀: 기존 소비자가 이번 변경에 영향받지 않음 확인'],
    };
  }

  return {
    whatItDoes: `${ctx.label} is a ${ctx.type} node. ${ctx.description} Located at ${ctx.file ?? 'unknown'}.`,
    whyItMatters: `Called by [${callers}] and depends on [${deps}]. ${ctx.isNew ? 'Newly added in this PR.' : ctx.isChanged ? 'Modified in this PR.' : 'Unchanged but affected by connected changes.'} Risk level: ${ctx.riskLevel}.`,
    whatMayBreak: `Changes to ${ctx.label} directly impact [${callers}]. Failures in [${deps}] will surface here first.`,
    recommendedTests: [`Unit: ${ctx.label} handles its primary happy-path correctly`, `Unit: returns safe default when upstream is unavailable`, `Integration: end-to-end flow through ${ctx.label} produces expected output`, `Regression: existing consumers are unaffected by this change`],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function explainNode(ctx: NodeContext, lang: Lang = 'en'): Promise<AIExplanation> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) return getMockExplanation(ctx, lang);

  try {
    return await callOpenAI(ctx, lang);
  } catch (err) {
    console.warn('[aiExplain] OpenAI call failed, using mock:', err);
    return getMockExplanation(ctx, lang);
  }
}

function getMockExplanation(ctx: NodeContext, lang: Lang): AIExplanation {
  const map = lang === 'ko' ? MOCK_KO : MOCK_EN;
  return map[ctx.id] ?? generateGenericMock(ctx, lang);
}
