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
import Icon from '../components/ui/Icon.jsx';
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
    <div className="flex flex-col h-full">
      {/* Kanban Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-h1 text-[40px] leading-[1.2] font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-slate-400 font-subtitle text-sm mt-1">Manage and coordinate project sprints with AI-assisted priority routing.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/5 rounded-xl p-1 flex border border-white/10 backdrop-blur-md">
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'kanban' ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setSearchParams({})}
            >
              <Icon name="grid_view" className="text-[18px]" /> Board
            </button>
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-[#6c63ff] text-white' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setSearchParams({ view: 'list' })}
            >
              <Icon name="list" className="text-[18px]" /> List
            </button>
          </div>
          
          <button 
            className="bg-[#6c63ff] hover:bg-[#5a52e0] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[0_4px_20px_rgba(108,99,255,0.2)]"
            onClick={() => setShowCreateModal(true)}
          >
            <Icon name="add" /> New Task
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATUSES.map((s) => <Skeleton key={s} className="min-h-[716px] rounded-xl" />)}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 h-full items-start">
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
