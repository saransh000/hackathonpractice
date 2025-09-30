import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { User, Clock, AlertCircle } from 'lucide-react';
import type { Task } from '../types';
import { cn } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-4 border-l-rose-500 bg-gradient-to-r from-rose-50 to-white dark:from-rose-950/30 dark:to-gray-800';
      case 'medium':
        return 'border-l-4 border-l-amber-500 bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/30 dark:to-gray-800';
      case 'low':
        return 'border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-800';
      default:
        return 'border-l-4 border-l-gray-500 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return <div className="flex items-center gap-1 px-2 py-1 bg-rose-100 dark:bg-rose-900/40 rounded-full"><AlertCircle className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" /><span className="text-xs font-semibold text-rose-700 dark:text-rose-300">High</span></div>;
      case 'medium':
        return <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 dark:bg-amber-900/40 rounded-full"><AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /><span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Med</span></div>;
      case 'low':
        return <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 rounded-full"><AlertCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Low</span></div>;
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'task-card group',
        getPriorityColor(task.priority),
        isDragging ? 'opacity-50 rotate-2 scale-105 shadow-2xl' : ''
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 flex-1 pr-2 group-hover:text-gray-900 dark:group-hover:text-white tracking-tight">
          {task.title}
        </h3>
        {getPriorityIcon(task.priority)}
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed font-normal">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
              <div className="h-5 w-5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">{task.assignee}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800 px-2.5 py-1 rounded-full">
              <User className="h-3 w-3" />
              <span>Unassigned</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <Clock className="h-3 w-3" />
          <span>{new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  );
};