import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'
import Settings from './pages/Settings'
import NewHandover from './pages/NewHandover'

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

  const handleNavigate = (view) => {
    if (view === 'settings') {
      setCurrentView('settings');
      setActiveWorkspaceId(null);
    } else if (view === 'dashboard') {
      navigateToDashboard();
    } else {
      // Assume ID
      navigateToWorkspace(view);
    }
  };

  return (
    <div className="app-container">
      {currentView === 'dashboard' && (
        <Dashboard onNavigate={handleNavigate} currentView="dashboard" />
      )}
      {currentView === 'workspace' && (
        <Workspace
          workspaceId={activeWorkspaceId}
          onBack={navigateToDashboard}
          currentView="workspace" // Though sidebar might still show Handovers active?
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'settings' && (
        <Settings onNavigate={handleNavigate} />
      )}
      {currentView === 'create' && (
        <NewHandover onNavigate={handleNavigate} />
      )}
    </div>
  )
}

export default App
