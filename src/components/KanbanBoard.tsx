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
  boardId: string | null;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ board, onUpdateBoard, boardId }) => {
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

  const handleDragOver = async (event: DragOverEvent) => {
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

      // Update task status in database
      try {
        await fetch(`http://localhost:5000/api/tasks/${activeTask.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            status: overColumn.id
          })
        });
        console.log('✅ Task status updated in database:', activeTask.id, '→', overColumn.id);
      } catch (error) {
        console.error('❌ Failed to update task status:', error);
      }
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

  const handleTaskSubmit = async (taskData: CreateTaskData) => {
    try {
      // Check if boardId is available
      if (!boardId) {
        alert('Board is not initialized. Please refresh the page.');
        console.error('❌ No boardId available');
        return;
      }

      // Create task in database first
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          status: selectedColumnId,
          assignedTo: taskData.assignee,
          boardId: boardId,  // ✅ Include boardId
          column: selectedColumnId  // ✅ Include column
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const result = await response.json();
      const savedTask = result.data.task;

      // Create task object with database ID
      const newTask: Task = {
        id: savedTask._id,
        title: savedTask.title,
        description: savedTask.description || '',
        assignee: savedTask.assignedTo,
        priority: savedTask.priority,
        createdAt: new Date(savedTask.createdAt),
        updatedAt: new Date(savedTask.updatedAt),
      };

      const updatedColumns = board.columns.map(column =>
        column.id === selectedColumnId
          ? { ...column, tasks: [...column.tasks, newTask] }
          : column
      );

      onUpdateBoard({ ...board, columns: updatedColumns });
      console.log('✅ Task created and synced:', newTask);
    } catch (error) {
      console.error('❌ Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const selectedColumn = board.columns.find(col => col.id === selectedColumnId);

  return (
    <div className="min-h-screen px-8 py-4 max-w-screen-2xl mx-auto">
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
          {board.columns.map((column, index) => (
            <div
              key={column.id}
              className="animate-fade-in-up opacity-0"
              style={{ animationDelay: `${1.1 + index * 0.15}s` }}
            >
              <Column
                column={column}
                onAddTask={handleAddTask}
              />
            </div>
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