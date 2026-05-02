import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { tasksAPI } from '../lib/api.js';
import useApi from '../hooks/useApi.js';
import KanbanColumn from '../components/tasks/KanbanColumn.jsx';
import TaskDetail from '../components/tasks/TaskDetail.jsx';
import TaskFormModal from '../components/tasks/TaskFormModal.jsx';
import TaskList from './TaskList.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import { Plus, LayoutGrid, List } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['todo', 'in_progress', 'review', 'done'];

export default function KanbanBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = searchParams.get('view') || 'kanban';
  const { data, loading, execute: fetchTasks } = useApi(tasksAPI.list);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  useEffect(() => {
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterTeam) params.teamId = filterTeam;
    fetchTasks(params);
  }, [filterStatus, filterTeam]);

  async function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    // over.id is the column status
    const taskId = active.id;
    const newStatus = over.id;
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
      toast.success(`Moved to ${newStatus.replace('_', ' ')}`);
      fetchTasks();
    } catch (err) {
      toast.error(err.message);
    }
  }

  const tasks = data?.tasks || [];

  if (viewMode === 'list') {
    return <TaskList tasks={tasks} loading={loading} onRefresh={fetchTasks} onTaskClick={(t) => setSelectedTaskId(t.id)} />;
  }

  return (
    <div className="kanban-page">
      <div className="kanban-page__header">
        <h1 className="page-title">Tasks</h1>
        <div className="kanban-page__controls">
          <button className={`btn btn--sm ${viewMode === 'kanban' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setSearchParams({})}>
            <LayoutGrid size={16} /> Board
          </button>
          <button className={`btn btn--sm ${viewMode === 'list' ? 'btn--primary' : 'btn--ghost'}`} onClick={() => setSearchParams({ view: 'list' })}>
            <List size={16} /> List
          </button>
          <button className="btn btn--primary btn--sm" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', gap: 16 }}>
          {STATUSES.map((s) => <Skeleton key={s} variant="card" height={300} width={250} />)}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {STATUSES.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasks.filter((t) => t.status === status)}
                onTaskClick={(t) => setSelectedTaskId(t.id)}
              />
            ))}
          </div>
        </DndContext>
      )}

      {selectedTaskId && (
        <TaskDetail taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} onUpdate={fetchTasks} />
      )}

      <TaskFormModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={fetchTasks} />
    </div>
  );
}
