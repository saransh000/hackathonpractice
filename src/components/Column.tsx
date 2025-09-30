import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import type { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { cn } from '../lib/utils';

interface ColumnProps {
  column: ColumnType;
  onAddTask?: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({ column, onAddTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="column">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="font-display font-bold text-gray-800 dark:text-gray-100 text-base tracking-tight">{column.title}</h2>
          <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
            {column.tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button
            onClick={() => onAddTask(column.id)}
            className="p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 rounded-lg transition-all duration-200 group"
            title="Add new task"
          >
            <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </button>
        )}
      </div>
      
      <div
        ref={setNodeRef}
        className={cn(
          'flex-1 space-y-3 min-h-32 rounded-xl p-3 transition-all duration-300',
          isOver ? 'bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-300 dark:border-blue-600 border-dashed shadow-inner scale-[1.02]' : 'border-2 border-transparent'
        )}
      >
        <SortableContext items={column.tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {column.tasks.map((task: Task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {column.tasks.length === 0 && (
          <div className="flex items-center justify-center h-40 text-gray-400 dark:text-gray-500 text-sm">
            <div className="text-center">
              <div className="mb-3 text-4xl">📋</div>
              <div className="mb-2 font-medium">No tasks yet</div>
              {onAddTask && (
                <button
                  onClick={() => onAddTask(column.id)}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline hover:no-underline transition-all"
                >
                  Add your first task
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};