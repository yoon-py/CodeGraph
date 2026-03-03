import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { blueprintNodes } from '../data/blueprint/nodes';
import { blueprintEdges } from '../data/blueprint/edges';
import { flowPaths } from '../data/blueprint/flows';
import { useBlueprintStore } from '../store/blueprintStore';

export function useFlowHighlight(): { nodes: Node[]; edges: Edge[] } {
  const { selectedFlowId } = useBlueprintStore();

  return useMemo(() => {
    if (!selectedFlowId) {
      const nodes = blueprintNodes.map((n) => ({
        ...n,
        style: { opacity: 1 },
      })) as Node[];
      const edges: Edge[] = blueprintEdges.map((e) => ({
        ...e,
        animated: false,
        style: {
          ...(typeof e.style === 'object' ? e.style : {}),
          strokeDasharray:
            (e.data as { edgeType?: string } | undefined)?.edgeType === 'data'
              ? '6 3'
              : undefined,
          opacity: 1,
          stroke: '#4f9cf9',
          strokeWidth: 1.5,
        },
      }));
      return { nodes, edges };
    }

    const flow = flowPaths.find((f) => f.id === selectedFlowId);
    if (!flow) {
      return { nodes: blueprintNodes as Node[], edges: blueprintEdges };
    }

    const activeNodeIds = new Set(flow.nodeIds);
    const activeEdgeIds = new Set(flow.edgeIds);

    const nodes = blueprintNodes.map((n) => ({
      ...n,
      style: {
        opacity: activeNodeIds.has(n.id) ? 1 : 0.15,
        transition: 'opacity 0.2s ease',
      },
    })) as Node[];

    const edges: Edge[] = blueprintEdges.map((e) => {
      const isActive = activeEdgeIds.has(e.id);
      return {
        ...e,
        animated: isActive,
        style: {
          ...(typeof e.style === 'object' ? e.style : {}),
          strokeDasharray:
            !isActive && (e.data as { edgeType?: string } | undefined)?.edgeType === 'data'
              ? '6 3'
              : undefined,
          opacity: isActive ? 1 : 0.15,
          stroke: isActive ? flow.color : '#4f9cf9',
          strokeWidth: isActive ? 2.5 : 1.5,
          transition: 'opacity 0.2s ease, stroke 0.2s ease',
        },
      };
    });

    return { nodes, edges };
  }, [selectedFlowId]);
}
