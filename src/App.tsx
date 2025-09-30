import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DatabaseViewerPage } from './pages/DatabaseViewerPage';
import { Header } from './components/Header';
import { ConnectedKanbanBoard } from './components/ConnectedKanbanBoard';

function App() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<'kanban' | 'database'>('kanban');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (currentPage === 'database') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <Header />
        <div className="pt-20">
          <div className="max-w-7xl mx-auto px-4 mb-4">
            <button
              onClick={() => setCurrentPage('kanban')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold"
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
      <Header />
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <button
            onClick={() => setCurrentPage('database')}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all font-semibold shadow-lg"
          >
            📊 View Database
          </button>
        </div>
        <main>
          <ConnectedKanbanBoard />
        </main>
      </div>
    </div>
  );
}

export default App;
