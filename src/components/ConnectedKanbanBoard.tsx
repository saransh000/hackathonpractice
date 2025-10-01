import React, { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { KanbanBoard } from './KanbanBoard';
import type { Board, Column, Task } from '../types';
import type { Team } from '../types/team';
import { getTasks } from '../api/tasks';
import { teamAPI } from '../api/teams';
import { getBoards, createBoard } from '../api/boards';
import { socketService } from '../services/socket';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_COLUMNS: Array<Pick<Column, 'id' | 'title' | 'tasks'>> = [
  { id: 'pending', title: 'Pending', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'completed', title: 'Completed', tasks: [] },
];

export const ConnectedKanbanBoard: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [boardId, setBoardId] = useState<string | null>(null);
  const [isBoardLoading, setIsBoardLoading] = useState(true);
  
  const [board, setBoard] = useState<Board>({
    id: 'main',
    title: 'Hackathon Helper Board',
    columns: DEFAULT_COLUMNS as Column[],
    teamMembers: [],
  });

  // Load teams and initialize board on mount (only when user is available)
  useEffect(() => {
    if (user) {
      loadTeams();
      initializeBoard();
    }
  }, [user]);

  // Initialize Socket.IO when component mounts
  useEffect(() => {
    socketService.connect();

    return () => {
      if (selectedTeam) {
        socketService.leaveTeam(selectedTeam._id, user?.id || '', user?.name || '');
      }
      socketService.disconnect();
    };
  }, []);

  // Join team room when team is selected
  useEffect(() => {
    if (selectedTeam && user) {
      socketService.joinTeam(selectedTeam._id, user.id, user.name);
      
      // Listen for real-time updates
      socketService.onTaskUpdated(handleRemoteTaskUpdate);
      socketService.onColumnsUpdated(handleRemoteColumnsUpdate);
      socketService.onUserJoined(handleUserJoined);
      socketService.onUserLeft(handleUserLeft);
      socketService.onActiveUsers(handleActiveUsers);

      return () => {
        socketService.off('task-updated');
        socketService.off('columns-updated');
        socketService.off('user-joined');
        socketService.off('user-left');
        socketService.off('active-users');
      };
    }
  }, [selectedTeam, user]);

  const loadTeams = async () => {
    try {
      const data = await teamAPI.getMyTeams();
      setTeams(data);
      // Auto-select first team if available
      if (data.length > 0 && !selectedTeam) {
        setSelectedTeam(data[0]);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    }
  };

  // Initialize or get user's default board
  const initializeBoard = async () => {
    try {
      setIsBoardLoading(true);
      console.log('🔄 Initializing board...');
      
      // Try to get existing boards
      const boards = await getBoards();
      
      if (boards.length > 0) {
        // Use the first board
        const userBoard = boards[0];
        setBoardId(userBoard._id);
        setBoard(prev => ({ ...prev, id: userBoard._id }));
        console.log('✅ Loaded existing board:', userBoard._id);
      } else {
        // Create a default board
        console.log('📋 No boards found, creating default board...');
        const newBoard = await createBoard({
          title: 'My Hackathon Board',
          description: 'Default board for task management',
          isPublic: false
        });
        setBoardId(newBoard._id);
        setBoard(prev => ({ ...prev, id: newBoard._id }));
        console.log('✅ Created new board:', newBoard._id);
      }
    } catch (err) {
      console.error('❌ Failed to initialize board:', err);
      alert('Failed to initialize board. Please refresh the page and try again.');
    } finally {
      setIsBoardLoading(false);
    }
  };

  // Load tasks initially
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const apiTasks = await getTasks();
        if (ignore) return;
        const mapped: Record<string, Task[]> = { 'pending': [], 'in-progress': [], 'completed': [] };
        for (const t of apiTasks) {
          mapped[t.status ?? 'pending'].push({
            id: t._id,
            title: t.title,
            description: t.description || '',
            assignee: t.assignedTo,
            priority: (t.priority as Task['priority']) || 'medium',
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
          });
        }
        const cols = board.columns.map(c => ({ ...c, tasks: mapped[c.id] || [] })) as Column[];
        setBoard(prev => ({ 
          ...prev, 
          columns: cols,
          teamMembers: selectedTeam?.members.map(m => ({
            id: m._id,
            name: m.name,
            email: m.email
          })) || []
        }));
      } catch (err) {
        console.warn('Failed to load tasks from API:', err);
      }
    })();
    return () => { ignore = true; };
  }, [selectedTeam]);

  const handleUpdate = (b: Board) => {
    setBoard(b);
    
    // Broadcast changes to team members
    if (selectedTeam) {
      socketService.emitColumnUpdate(selectedTeam._id, b.columns);
    }
  };

  const handleRemoteTaskUpdate = (data: any) => {
    console.log('📝 Remote task update received:', data);
    // Reload tasks to sync with remote changes
    loadTasks();
  };

  const handleRemoteColumnsUpdate = (data: any) => {
    console.log('📋 Remote columns update received:', data);
    // Reload tasks from database to get the latest data
    loadTasks();
  };

  const handleUserJoined = (data: any) => {
    console.log('👋 User joined:', data.userName);
    // Show notification or update UI
  };

  const handleUserLeft = (data: any) => {
    console.log('👋 User left:', data.userName);
    // Show notification or update UI
  };

  const handleActiveUsers = (users: string[]) => {
    setActiveUsers(users);
  };

  const loadTasks = async () => {
    try {
      const apiTasks = await getTasks();
      const mapped: Record<string, Task[]> = { 'pending': [], 'in-progress': [], 'completed': [] };
      for (const t of apiTasks) {
        mapped[t.status ?? 'pending'].push({
          id: t._id,
          title: t.title,
          description: t.description || '',
          assignee: t.assignedTo,
          priority: (t.priority as Task['priority']) || 'medium',
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        });
      }
      const cols = board.columns.map(c => ({ ...c, tasks: mapped[c.id] || [] })) as Column[];
      setBoard(prev => ({ ...prev, columns: cols }));
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  return (
    <div className="relative">
      {/* Team Selector Bar */}
      <div className="mb-6 px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Team</p>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedTeam ? selectedTeam.name : 'No Team Selected'}
                </h3>
                {selectedTeam && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full">
                    {selectedTeam.members.length} members
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Active Users Indicator */}
            {selectedTeam && activeUsers.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex -space-x-2">
                  {activeUsers.slice(0, 3).map((userId, idx) => (
                    <div
                      key={userId}
                      className="h-8 w-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white font-bold text-xs"
                      title={`User ${userId}`}
                    >
                      {idx + 1}
                    </div>
                  ))}
                  {activeUsers.length > 3 && (
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-xs">
                      +{activeUsers.length - 3}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                  {activeUsers.length} online
                </span>
              </div>
            )}
            
            {/* Change Team Button */}
            <button
              onClick={() => setShowTeamSelector(!showTeamSelector)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Change Team
            </button>
          </div>
        </div>

        {/* Team Selector Dropdown */}
        {showTeamSelector && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 max-h-64 overflow-y-auto">
            {teams.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                No teams available. Create or join a team from the Teams page.
              </p>
            ) : (
              <div className="space-y-2">
                {teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => {
                      setSelectedTeam(team);
                      setShowTeamSelector(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                      selectedTeam?._id === team._id
                        ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{team.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {team.members.length} members
                        </p>
                      </div>
                      {selectedTeam?._id === team._id && (
                        <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Kanban Board */}
      {isBoardLoading ? (
        <div className="text-center py-16 px-8">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Initializing Board...
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your workspace, please wait...
          </p>
        </div>
      ) : selectedTeam ? (
        <KanbanBoard board={board} onUpdateBoard={handleUpdate} boardId={boardId} />
      ) : (
        <div className="text-center py-16 px-8">
          <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Select a Team to Get Started
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Choose a team from the dropdown above or create a new team from the Teams page.
          </p>
        </div>
      )}
    </div>
  );
};
