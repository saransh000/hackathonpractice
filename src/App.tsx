import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DatabaseViewerPage } from './pages/DatabaseViewerPage';
import { LoginHistoryPage } from './pages/LoginHistoryPage';
import { Header } from './components/Header';
import { ConnectedKanbanBoard } from './components/ConnectedKanbanBoard';
import { MessagingPanel } from './components/MessagingPanel';
import { TeamManagement } from './components/TeamManagement';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'kanban' | 'database' | 'login-history' | 'teams'>('kanban');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (currentPage === 'database') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Header 
          onNavigateToDatabase={() => setCurrentPage('kanban')}
          onNavigateToLoginHistory={() => setCurrentPage('login-history')}
          showDatabaseButton={false}
          showLoginHistoryButton={user?.role === 'admin'}
        />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <button
              onClick={() => setCurrentPage('kanban')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold shadow-lg"
            >
              ← Back to Kanban Board
            </button>
          </div>
          <DatabaseViewerPage />
        </div>
      </div>
    );
  }

  if (currentPage === 'login-history') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Header 
          onNavigateToDatabase={() => setCurrentPage('database')}
          onNavigateToLoginHistory={() => setCurrentPage('kanban')}
          showDatabaseButton={user?.role === 'admin'}
          showLoginHistoryButton={false}
        />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <button
              onClick={() => setCurrentPage('kanban')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold shadow-lg"
            >
              ← Back to Kanban Board
            </button>
          </div>
          <LoginHistoryPage />
        </div>
      </div>
    );
  }

  if (currentPage === 'teams') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Header 
          onNavigateToDatabase={() => setCurrentPage('database')}
          onNavigateToLoginHistory={() => setCurrentPage('login-history')}
          onNavigateToTeams={() => setCurrentPage('kanban')}
          showDatabaseButton={user?.role === 'admin'}
          showLoginHistoryButton={user?.role === 'admin'}
          showTeamsButton={false}
        />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <button
              onClick={() => setCurrentPage('kanban')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold shadow-lg"
            >
              ← Back to Kanban Board
            </button>
          </div>
          <TeamManagement />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <Header 
        onNavigateToDatabase={() => setCurrentPage('database')}
        onNavigateToLoginHistory={() => setCurrentPage('login-history')}
        onNavigateToTeams={() => setCurrentPage('teams')}
        showDatabaseButton={user?.role === 'admin'}
        showLoginHistoryButton={user?.role === 'admin'}
        showTeamsButton={true}
      />
      <main className="pt-20">
        <ConnectedKanbanBoard />
      </main>
      <MessagingPanel />
    </div>
  );
}

export default App;
