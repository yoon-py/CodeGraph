import { Toolbar } from './components/shared/Toolbar';
import { AnalysisView } from './views/AnalysisView';
import { useAIPreload } from './hooks/useAIPreload';

function AppInner() {
  useAIPreload();

  return (
    <div className="app-shell">
      <Toolbar />
      <AnalysisView />
    </div>
  );
}

export function App() {
  return <AppInner />;
}
