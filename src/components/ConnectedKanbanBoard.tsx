import React, { useEffect, useState } from 'react';
import { KanbanBoard } from './KanbanBoard';
import type { Board, Column, Task } from '../types';
import { getTasks } from '../api/tasks';

const DEFAULT_COLUMNS: Array<Pick<Column, 'id' | 'title' | 'tasks'>> = [
  { id: 'pending', title: 'Pending', tasks: [] },
  { id: 'in-progress', title: 'In Progress', tasks: [] },
  { id: 'completed', title: 'Completed', tasks: [] },
];

export const ConnectedKanbanBoard: React.FC = () => {
  const [board, setBoard] = useState<Board>({
    id: 'main',
    title: 'Hackathon Helper Board',
    columns: DEFAULT_COLUMNS as Column[],
    teamMembers: [],
  });

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
        setBoard(prev => ({ ...prev, columns: cols }));
      } catch (err) {
        console.warn('Failed to load tasks from API:', err);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const handleUpdate = (b: Board) => setBoard(b);

  return <KanbanBoard board={board} onUpdateBoard={handleUpdate} />;
};
