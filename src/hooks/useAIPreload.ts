import { useEffect } from 'react';
import { analysisNodes } from '../data/analysis/nodes';
import { prChangeSet } from '../data/analysis/changeset';
import { explainNode } from '../services/aiExplain';
import type { NodeContext } from '../services/aiExplain';
import { useAIStore } from '../store/aiStore';
import { useLangStore } from '../i18n/index';

export function useAIPreload() {
  const lang = useLangStore((s) => s.lang);
  const setExplanation = useAIStore((s) => s.setExplanation);
  const setLoading = useAIStore((s) => s.setLoading);

  useEffect(() => {
    const tasks = analysisNodes.map(async (n) => {
      const key = `${n.id}__${lang}`;
      setLoading(key, true);

      const ctx: NodeContext = {
        id: n.id,
        label: n.label,
        type: n.type,
        description: n.description,
        file: n.file,
        isNew: prChangeSet.newNodeIds.includes(n.id),
        isChanged: prChangeSet.changedNodeIds.includes(n.id),
        riskLevel: n.riskLevel ?? 'none',
        changeDescription: n.changeDescription,
        detail: n.detail,
      };

      try {
        const result = await explainNode(ctx, lang);
        setExplanation(key, result);
      } catch (err) {
        console.warn(`[useAIPreload] Failed for ${n.id}:`, err);
      } finally {
        setLoading(key, false);
      }
    });

    void Promise.allSettled(tasks);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);
}
