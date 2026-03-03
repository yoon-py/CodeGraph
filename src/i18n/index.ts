import { create } from 'zustand';

export type Lang = 'en' | 'ko';

// ─── Translation table ────────────────────────────────────────────────────────

const T = {
  en: {
    // Toolbar
    nodes: 'nodes', edges: 'edges',
    // Search panel
    search: 'SEARCH', searchPlaceholder: 'Search nodes…',
    activePR: 'ACTIVE PR', showChangedOnly: 'Show changed nodes only',
    resetFilters: 'Reset filters', files: 'files',
    // Filter group
    nodeTypes: 'NODE TYPES', edgeTypes: 'EDGE TYPES',
    nodeService: 'Service', nodeExternal: 'External', nodeDatabase: 'Database',
    nodeMobile: 'Mobile', nodeScheduler: 'Scheduler',
    edgeCall: 'Call', edgeData: 'Data', edgeEvent: 'Event', edgeSchedule: 'Schedule',
    // Legend
    legend: 'LEGEND', legendNew: 'New', legendModified: 'Modified', legendUnchanged: 'Unchanged',
    // Right panel
    tabInspector: 'Inspector', tabAIExplain: 'AI Explain',
    nodeDetail: 'NODE DETAIL', clickToView: 'Click a node to view details',
    summary: 'Summary', responsibilities: 'Responsibilities',
    dependsOn: 'Depends On', affectedBy: 'Affected By',
    apiRoutes: 'API Routes', tables: 'Tables', potentialRisk: 'Potential Risk',
    // AI Explain panel
    clickToExplain: 'Click a node to get an AI explanation',
    regenerate: 'Regenerate', analyzing: 'Analyzing…',
    mockBadge: 'Mock response', aiBadge: 'GPT-4o-mini · OpenAI Responses API',
    sectionWhatItDoes: 'What this node does',
    sectionWhyMatters: 'Why it matters in this flow',
    sectionWhatBreaks: 'What may break if this changes',
    sectionTests: 'Recommended tests', apiError: 'API Error',
    // Blueprint
    flowLabel: 'Flow', flowAll: 'All',
    // AI prompt lang instruction
    aiLangInstruction: '',
  },
  ko: {
    // Toolbar
    nodes: '노드', edges: '엣지',
    // Search panel
    search: '검색', searchPlaceholder: '노드 검색…',
    activePR: '현재 PR', showChangedOnly: '변경된 노드만 보기',
    resetFilters: '필터 초기화', files: '파일',
    // Filter group
    nodeTypes: '노드 유형', edgeTypes: '엣지 유형',
    nodeService: '서비스', nodeExternal: '외부', nodeDatabase: 'DB',
    nodeMobile: '모바일', nodeScheduler: '스케줄러',
    edgeCall: '호출', edgeData: '데이터', edgeEvent: '이벤트', edgeSchedule: '스케줄',
    // Legend
    legend: '범례', legendNew: '신규', legendModified: '수정', legendUnchanged: '미변경',
    // Right panel
    tabInspector: 'Inspector', tabAIExplain: 'AI 설명',
    nodeDetail: '노드 상세', clickToView: '노드를 클릭하면 상세 정보가 표시됩니다',
    summary: '요약', responsibilities: '역할',
    dependsOn: '의존 대상', affectedBy: '영향받음',
    apiRoutes: 'API 라우트', tables: '테이블', potentialRisk: '잠재 위험',
    // AI Explain panel
    clickToExplain: '노드를 클릭하면 AI 설명을 생성합니다',
    regenerate: '재생성', analyzing: '분석 중…',
    mockBadge: 'Mock 응답', aiBadge: 'GPT-4o-mini · OpenAI Responses API',
    sectionWhatItDoes: '이 노드가 하는 일',
    sectionWhyMatters: '현재 흐름에서의 중요성',
    sectionWhatBreaks: '변경 시 영향 범위',
    sectionTests: '권장 테스트', apiError: 'API 오류',
    // Blueprint
    flowLabel: '흐름', flowAll: '전체',
    // AI prompt lang instruction
    aiLangInstruction: '반드시 한국어로 응답하세요.',
  },
} as const;

export type TKeys = keyof typeof T.en;

// ─── Zustand store ────────────────────────────────────────────────────────────

interface LangState {
  lang: Lang;
  setLang: (l: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: 'en',
  setLang: (lang) => set({ lang }),
}));

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useT(): (typeof T)[Lang] {
  const { lang } = useLangStore();
  return T[lang];
}
