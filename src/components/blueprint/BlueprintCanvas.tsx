import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../../styles/reactflow-overrides.css';

import { InServiceNode } from './nodes/InServiceNode';
import { SchedulerNode } from './nodes/SchedulerNode';
import { AlertProcessorNode } from './nodes/AlertProcessorNode';
import { NotifierNode } from './nodes/NotifierNode';
import { EventStoreNode } from './nodes/EventStoreNode';
import { ExternalApiNode } from './nodes/ExternalApiNode';
import { MobileBpNode } from './nodes/MobileBpNode';
import { useFlowHighlight } from '../../hooks/useFlowHighlight';

// nodeTypes defined OUTSIDE component
const nodeTypes = {
  inServiceNode: InServiceNode,
  schedulerNode: SchedulerNode,
  alertProcessorNode: AlertProcessorNode,
  notifierNode: NotifierNode,
  eventStoreNode: EventStoreNode,
  externalApiNode: ExternalApiNode,
  mobileNode: MobileBpNode,
};

export function BlueprintCanvas() {
  const { nodes, edges } = useFlowHighlight();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
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
          if (type === 'inServiceNode') return '#4f9cf9';
          if (type === 'schedulerNode') return '#eab308';
          if (type === 'alertProcessorNode') return '#4f9cf9';
          if (type === 'notifierNode') return '#4f9cf9';
          if (type === 'eventStoreNode') return '#22c55e';
          if (type === 'externalApiNode') return '#a855f7';
          if (type === 'mobileNode') return '#f97316';
          return '#4b5e7a';
        }}
        maskColor="rgba(10,14,23,0.7)"
      />
    </ReactFlow>
  );
}
