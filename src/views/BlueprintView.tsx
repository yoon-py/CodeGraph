import { FlowSelector } from '../components/blueprint/FlowSelector';
import { Legend } from '../components/blueprint/Legend';
import { BlueprintCanvas } from '../components/blueprint/BlueprintCanvas';

export function BlueprintView() {
  return (
    <div className="blueprint-layout">
      <div className="blueprint-controls">
        <FlowSelector />
        <Legend />
      </div>
      <div className="blueprint-canvas-wrap">
        <BlueprintCanvas />
      </div>
    </div>
  );
}
