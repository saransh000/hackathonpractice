import React from 'react';
import { Plus, Users, BarChart3, TrendingUp } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import type { Board } from '../types';

interface EnhancedHeaderProps {
  board: Board;
  onAddTask: () => void;
}

export const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({ board, onAddTask }) => {
  const totalTasks = board.columns.reduce((total, col) => total + col.tasks.length, 0);
  const completedTasks = board.columns.find(col => col.id === 'done')?.tasks.length || 0;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="relative glass-effect p-6 rounded-2xl mb-6 border-2 border-white/40 dark:border-gray-700/40 shadow-lg animate-slide-up">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-2xl pointer-events-none"></div>
      <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-5xl font-black mb-1 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-sm animate-gradient">
              {board.title}
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base font-medium">
            Organize your hackathon tasks and collaborate with your team
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onAddTask}
            className="relative group bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3.5 px-7 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center gap-2.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <Plus className="h-5 w-5 relative z-10" />
            <span className="relative z-10 text-base">Add New Task</span>
          </button>
          <ThemeToggle />
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 text-blue-500" />
            <span className="font-semibold">Team</span>
          </div>
          <div className="flex items-center -space-x-2">
            {board.teamMembers.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800 shadow-lg transform hover:scale-110 hover:z-10 transition-all duration-300 cursor-pointer"
                title={member.name}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {board.teamMembers.length > 4 && (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 text-xs font-bold border-2 border-white dark:border-gray-800 shadow-lg">
                +{board.teamMembers.length - 4}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 px-4 py-2 rounded-2xl border border-blue-300/30 dark:border-blue-600/30 backdrop-blur-sm shadow-sm">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{board.columns.length} Columns</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 px-4 py-2 rounded-2xl border border-indigo-300/30 dark:border-indigo-600/30 backdrop-blur-sm shadow-sm">
            <div className="h-2.5 w-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{totalTasks} Tasks</span>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 px-4 py-2 rounded-2xl border border-purple-300/30 dark:border-purple-600/30 backdrop-blur-sm shadow-sm">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{completionRate}% Done</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};
