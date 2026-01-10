import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'
import Settings from './pages/Settings'
import NewHandover from './pages/NewHandover'
import Analytics from './pages/Analytics'
import TemplateLibrary from './pages/TemplateLibrary'
import TemplateEditor from './components/TemplateEditor'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

// Main App Component (wrapped with auth)
function AppContent() {
  const { user, loading } = useAuth();
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
    } else if (view === 'login') {
      setCurrentView('login');
    } else if (view === 'signup') {
      setCurrentView('signup');
    } else {
      // Assume ID
      navigateToWorkspace(view);
    }
  };

  // Show auth pages if not logged in
  if (!loading && !user) {
    return (
      <div className="app-container">
        <Login />
      </div>
    );
  }

  // Show protected app content
  return (
    <ProtectedRoute>
      <div className="app-container">
        {currentView === 'dashboard' && (
          <Dashboard onNavigate={handleNavigate} currentView="dashboard" />
        )}
        {currentView === 'workspace' && (
          <Workspace
            workspaceId={activeWorkspaceId}
            onBack={navigateToDashboard}
            currentView="workspace"
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
    </ProtectedRoute>
  )
}

// Wrapper with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
