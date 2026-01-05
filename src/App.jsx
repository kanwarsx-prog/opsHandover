import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'

// Simple router for prototype
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);

  const navigateToWorkspace = (workspaceId) => {
    setActiveWorkspaceId(workspaceId);
    setCurrentView('workspace');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setActiveWorkspaceId(null);
  };

  return (
    <div className="app-container">
      {currentView === 'dashboard' ? (
        <Dashboard onNavigate={navigateToWorkspace} />
      ) : (
        <Workspace workspaceId={activeWorkspaceId} onBack={navigateToDashboard} />
      )}
    </div>
  )
}

export default App
