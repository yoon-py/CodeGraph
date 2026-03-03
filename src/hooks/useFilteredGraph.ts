import { useMemo } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { analysisNodes } from '../data/analysis/nodes';
import { analysisEdges } from '../data/analysis/edges';
import { prChangeSet } from '../data/analysis/changeset';
import { analysisFlows } from '../data/analysis/flows';
import { useAnalysisStore } from '../store/analysisStore';
import type { GraphNode } from '../types/graph';

function buildAdjacency(edges: typeof analysisEdges): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, new Set());
    if (!adj.has(edge.target)) adj.set(edge.target, new Set());
    adj.get(edge.source)!.add(edge.target);
    adj.get(edge.target)!.add(edge.source);
  }
  return adj;
}

export function useFilteredGraph() {
  const { filters, selectedNodeId, selectedFlowId } = useAnalysisStore();
  const { searchQuery, nodeTypes, edgeTypes, showChangedOnly } = filters;

  return useMemo(() => {
    const adj = buildAdjacency(analysisEdges);
    const changedIds = new Set([
      ...prChangeSet.changedNodeIds,
      ...prChangeSet.newNodeIds,
    ]);

    // Step 1: Find seed nodes matching search
    let seedIds: Set<string>;
    if (searchQuery.trim() === '') {
      seedIds = new Set(analysisNodes.map((n) => n.id));
    } else {
      const q = searchQuery.toLowerCase();
      seedIds = new Set(
        analysisNodes
          .filter(
            (n) =>
              n.label.toLowerCase().includes(q) ||
              n.description.toLowerCase().includes(q) ||
              n.id.toLowerCase().includes(q) ||
              n.file?.toLowerCase().includes(q)
          )
          .map((n) => n.id)
      );
    }

    // Step 2: 1-hop expansion to avoid isolated nodes
    const visibleIds = new Set(seedIds);
    if (searchQuery.trim() !== '') {
      for (const id of seedIds) {
        const neighbors = adj.get(id) ?? new Set();
        for (const neighbor of neighbors) {
          visibleIds.add(neighbor);
        }
      }
    }

    // Step 3: Apply nodeType filter
    const nodeTypeFiltered = analysisNodes.filter(
      (n) => visibleIds.has(n.id) && nodeTypes.includes(n.type)
    );

    // Step 4: Apply showChangedOnly
    const afterChangedFilter = showChangedOnly
      ? nodeTypeFiltered.filter((n) => changedIds.has(n.id))
      : nodeTypeFiltered;

    const finalNodeIds = new Set(afterChangedFilter.map((n) => n.id));

    // Step 5: Edges — keep only edges where both endpoints visible
    const visibleEdges = analysisEdges.filter(
      (e) =>
        finalNodeIds.has(e.source) &&
        finalNodeIds.has(e.target) &&
        edgeTypes.includes(e.type) &&
        e.source !== e.target
    );

    // Step 6: Compute highlighting — flow takes priority over node selection
    const activeFlow = selectedFlowId
      ? analysisFlows.find((f) => f.id === selectedFlowId) ?? null
      : null;
    const flowNodeIds = activeFlow ? new Set(activeFlow.nodeIds) : null;

    const highlightNeighbors = new Set<string>();
    if (!activeFlow && selectedNodeId && finalNodeIds.has(selectedNodeId)) {
      const adjNeighbors = adj.get(selectedNodeId) ?? new Set();
      for (const n of adjNeighbors) {
        if (finalNodeIds.has(n)) highlightNeighbors.add(n);
      }
    }

    // Step 7: Convert to React Flow format with opacity applied
    const rfNodes: Node[] = afterChangedFilter.map((n: GraphNode) => {
      let opacity = 1;
      if (flowNodeIds) {
        opacity = flowNodeIds.has(n.id) ? 1 : 0.15;
      } else if (selectedNodeId) {
        opacity = n.id === selectedNodeId || highlightNeighbors.has(n.id) ? 1 : 0.15;
      }

      return {
        id: n.id,
        type:
          n.type === 'service'
            ? 'serviceNode'
            : n.type === 'external'
            ? 'externalNode'
            : n.type === 'database'
            ? 'databaseNode'
            : n.type === 'mobile'
            ? 'mobileNode'
            : 'schedulerNode',
        position: n.position,
        data: {
          ...n,
          isNew: prChangeSet.newNodeIds.includes(n.id),
          isChanged: prChangeSet.changedNodeIds.includes(n.id),
        },
        style: { opacity, transition: 'opacity 0.2s ease' },
        ...(n.id === selectedNodeId ? { zIndex: 10 } : {}),
      };
    });

    const rfEdges: Edge[] = visibleEdges.map((e) => {
      let edgeOpacity = 1;
      let edgeStroke: string | undefined;
      let edgeStrokeWidth = 1.5;

      if (flowNodeIds) {
        const inFlow = flowNodeIds.has(e.source) && flowNodeIds.has(e.target);
        edgeOpacity = inFlow ? 1 : 0.15;
        if (inFlow && activeFlow) {
          edgeStroke = activeFlow.color;
          edgeStrokeWidth = 2.5;
        }
      } else if (selectedNodeId) {
        const sourceRelevant =
          e.source === selectedNodeId || highlightNeighbors.has(e.source);
        const targetRelevant =
          e.target === selectedNodeId || highlightNeighbors.has(e.target);
        edgeOpacity = sourceRelevant && targetRelevant ? 1 : 0.15;
      }

      const defaultStroke =
        e.type === 'schedule'
          ? '#94a3b8'
          : e.type === 'event'
          ? '#a855f7'
          : e.type === 'data'
          ? '#64748b'
          : '#4f9cf9';

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        label: e.label,
        animated: e.type === 'call',
        type: 'smoothstep',
        style: {
          strokeDasharray: e.type === 'data' ? '6 3' : undefined,
          stroke: edgeStroke ?? defaultStroke,
          strokeWidth: edgeStrokeWidth,
          opacity: edgeOpacity,
          transition: 'opacity 0.2s ease, stroke 0.2s ease',
        },
        labelStyle: { fontSize: 10, fill: '#64748b' },
        markerEnd: { type: 'arrowclosed' as const, color: edgeStroke ?? '#4f9cf9' },
      };
    });

    return { nodes: rfNodes, edges: rfEdges };
  }, [searchQuery, nodeTypes, edgeTypes, showChangedOnly, selectedNodeId, selectedFlowId]);
}
