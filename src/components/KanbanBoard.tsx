import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { Board, Task, CreateTaskData, Column as ColumnType } from '../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { AddTaskModal } from './AddTaskModal';
import { ThemeToggle } from './ThemeToggle';

interface KanbanBoardProps {
  board: Board;
  onUpdateBoard: (board: Board) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, onUpdateBoard }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = findTaskById(activeId);
    const activeColumn = findColumnByTaskId(activeId);
    const overColumn = findColumnById(overId) || findColumnByTaskId(overId);

    if (!activeTask || !activeColumn || !overColumn) return;

    if (activeColumn.id !== overColumn.id) {
      const updatedBoard = moveTaskBetweenColumns(activeTask, activeColumn, overColumn);
      onUpdateBoard(updatedBoard);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeTask = findTaskById(activeId);
    const activeColumn = findColumnByTaskId(activeId);
    const overTask = findTaskById(overId);

    if (!activeTask || !activeColumn) return;

    if (overTask) {
      const overColumn = findColumnByTaskId(overId);
      if (overColumn && activeColumn.id === overColumn.id) {
        const updatedBoard = reorderTasksInColumn(activeColumn, activeId, overId);
        onUpdateBoard(updatedBoard);
      }
    }
  };

  const findTaskById = (id: string): Task | null => {
    for (const column of board.columns) {
      const task = column.tasks.find(task => task.id === id);
      if (task) return task;
    }
    return null;
  };

  const findColumnById = (id: string): ColumnType | null => {
    return board.columns.find(column => column.id === id) || null;
  };

  const findColumnByTaskId = (taskId: string): ColumnType | null => {
    for (const column of board.columns) {
      if (column.tasks.some(task => task.id === taskId)) {
        return column;
      }
    }
    return null;
  };

  const moveTaskBetweenColumns = (task: Task, fromColumn: ColumnType, toColumn: ColumnType): Board => {
    const updatedColumns = board.columns.map(column => {
      if (column.id === fromColumn.id) {
        return {
          ...column,
          tasks: column.tasks.filter(t => t.id !== task.id),
        };
      }
      if (column.id === toColumn.id) {
        return {
          ...column,
          tasks: [...column.tasks, task],
        };
      }
      return column;
    });

    return { ...board, columns: updatedColumns };
  };

  const reorderTasksInColumn = (column: ColumnType, activeId: string, overId: string): Board => {
    const activeIndex = column.tasks.findIndex(task => task.id === activeId);
    const overIndex = column.tasks.findIndex(task => task.id === overId);

    const updatedTasks = arrayMove(column.tasks, activeIndex, overIndex);

    const updatedColumns = board.columns.map(col =>
      col.id === column.id ? { ...col, tasks: updatedTasks } : col
    );

    return { ...board, columns: updatedColumns };
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsAddModalOpen(true);
  };

  const handleTaskSubmit = (taskData: CreateTaskData) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedColumns = board.columns.map(column =>
      column.id === selectedColumnId
        ? { ...column, tasks: [...column.tasks, newTask] }
        : column
    );

    onUpdateBoard({ ...board, columns: updatedColumns });
  };

  const selectedColumn = board.columns.find(col => col.id === selectedColumnId);

  return (
    <div className="min-h-screen p-6">
      <div className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            {board.title}
          </h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex -space-x-2">
              {board.teamMembers.slice(0, 3).map((member) => (
                <div
                  key={member.id}
                  className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold border-2 border-white dark:border-gray-800 shadow-md"
                  title={member.name}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {board.teamMembers.length > 3 && (
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-bold border-2 border-white dark:border-gray-800 shadow-md">
                  +{board.teamMembers.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{board.columns.length} columns</span>
          </div>
          <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
            <div className="h-2 w-2 bg-indigo-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{board.columns.reduce((total, col) => total + col.tasks.length, 0)} tasks</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-full">
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{board.teamMembers.length} team members</span>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {board.columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onAddTask={handleAddTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="transform rotate-3 scale-110">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleTaskSubmit}
        columnTitle={selectedColumn?.title || ''}
      />
    </div>
  );
};