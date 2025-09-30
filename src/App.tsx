import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DatabaseViewerPage } from './pages/DatabaseViewerPage';
import { Header } from './components/Header';
import { ConnectedKanbanBoard } from './components/ConnectedKanbanBoard';
import { MessagingPanel } from './components/MessagingPanel';

function App() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState<'kanban' | 'database'>('kanban');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (currentPage === 'database') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Header 
          onNavigateToDatabase={() => setCurrentPage('kanban')}
          showDatabaseButton={false}
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <Header 
        onNavigateToDatabase={() => setCurrentPage('database')}
        showDatabaseButton={user?.role === 'admin'}
      />
      <main className="pt-20">
        <ConnectedKanbanBoard />
      </main>
      <MessagingPanel />
    </div>
  );
}

export default App;
