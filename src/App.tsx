import { useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { Header } from './components/Header';
import { ConnectedKanbanBoard } from './components/ConnectedKanbanBoard';
import { MessagingPanel } from './components/MessagingPanel';

function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <Header />
      <main className="pt-20">
        <ConnectedKanbanBoard />
      </main>
      <MessagingPanel />
    </div>
  );
}

export default App;
