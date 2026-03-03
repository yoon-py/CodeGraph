import { create } from 'zustand';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatStoreState {
  histories: Record<string, ChatMessage[]>;  // key = nodeId
  addMessage: (nodeId: string, msg: ChatMessage) => void;
  clearHistory: (nodeId: string) => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  histories: {},

  addMessage: (nodeId, msg) =>
    set((s) => ({
      histories: {
        ...s.histories,
        [nodeId]: [...(s.histories[nodeId] ?? []), msg],
      },
    })),

  clearHistory: (nodeId) =>
    set((s) => {
      const next = { ...s.histories };
      delete next[nodeId];
      return { histories: next };
    }),
}));
