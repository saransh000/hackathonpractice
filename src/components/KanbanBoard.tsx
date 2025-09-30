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
import { EnhancedHeader } from './EnhancedHeader';

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
    <div className="min-h-screen px-8 py-4 animate-slide-up max-w-screen-2xl mx-auto">
      <EnhancedHeader 
        board={board} 
        onAddTask={() => {
          setSelectedColumnId(board.columns[0]?.id || '');
          setIsAddModalOpen(true);
        }}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 w-full">
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
            <div className="transform rotate-3 scale-110 opacity-90">
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