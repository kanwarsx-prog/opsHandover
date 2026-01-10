import { useState } from 'react'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'
import Settings from './pages/Settings'
import NewHandover from './pages/NewHandover'
import Analytics from './pages/Analytics'
import TemplateLibrary from './pages/TemplateLibrary'
import TemplateEditor from './components/TemplateEditor'

// Simple router for prototype
function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(null);
  const [templateEditorId, setTemplateEditorId] = useState(null);

  const navigateToWorkspace = (workspaceId) => {
    setActiveWorkspaceId(workspaceId);
    setCurrentView('workspace');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    setActiveWorkspaceId(null);
  };

  const handleNavigate = (view, params = {}) => {
    if (view === 'settings') {
      setCurrentView('settings');
      setActiveWorkspaceId(null);
    } else if (view === 'create') {
      setCurrentView('create');
      setActiveWorkspaceId(null);
    } else if (view === 'analytics') {
      setCurrentView('analytics');
      setActiveWorkspaceId(null);
    } else if (view === 'template-library') {
      setCurrentView('template-library');
      setActiveWorkspaceId(null);
    } else if (view === 'template-editor') {
      setCurrentView('template-editor');
      setTemplateEditorId(params.templateId || null);
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
      {currentView === 'analytics' && (
        <Analytics onNavigate={handleNavigate} />
      )}
      {currentView === 'template-library' && (
        <TemplateLibrary
          onNavigate={handleNavigate}
          onBack={navigateToDashboard}
        />
      )}
      {currentView === 'template-editor' && (
        <TemplateEditor
          templateId={templateEditorId}
          onNavigate={handleNavigate}
          onBack={() => handleNavigate('template-library')}
        />
      )}
    </div>
  )
}

export default App
