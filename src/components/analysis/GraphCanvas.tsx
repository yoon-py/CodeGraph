import { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../../styles/reactflow-overrides.css';

import { ServiceNode } from './nodes/ServiceNode';
import { ExternalNode } from './nodes/ExternalNode';
import { DatabaseNode } from './nodes/DatabaseNode';
import { MobileNode, SchedulerNode } from './nodes/MobileNode';
import { useFilteredGraph } from '../../hooks/useFilteredGraph';
import { useAnalysisStore } from '../../store/analysisStore';

// nodeTypes must be defined OUTSIDE component to avoid remounts on re-render
const nodeTypes = {
  serviceNode: ServiceNode,
  externalNode: ExternalNode,
  databaseNode: DatabaseNode,
  mobileNode: MobileNode,
  schedulerNode: SchedulerNode,
};

export function GraphCanvas() {
  const { nodes, edges } = useFilteredGraph();
  const { setSelectedNodeId } = useAnalysisStore();

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onPaneClick={onPaneClick}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      minZoom={0.3}
      maxZoom={2}
      proOptions={{ hideAttribution: false }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      <Controls />
      <MiniMap
        nodeColor={(n) => {
          const type = n.type ?? '';
          if (type === 'serviceNode') return '#4f9cf9';
          if (type === 'externalNode') return '#a855f7';
          if (type === 'databaseNode') return '#22c55e';
          if (type === 'mobileNode') return '#f97316';
          if (type === 'schedulerNode') return '#eab308';
          return '#4b5e7a';
        }}
        maskColor="rgba(10,14,23,0.7)"
      />
    </ReactFlow>
  );
}
