import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Image, Video, Monitor, ListTodo } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import { Modal } from '../components/ui/Modal';
import { ActionMenu } from '../components/ui/ActionMenu';
import { ConfirmDeleteModal } from '../components/ui/ConfirmDeleteModal';
import './Tasks.css';

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Poster': return <Image size={18} />;
    case 'Video': return <Video size={18} />;
    case 'Website': return <Monitor size={18} />;
    default: return <Image size={18} />;
  }
};

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingTask, setDeletingTask] = useState<{id: string, title: string} | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    category: 'Poster',
    status: 'BACKLOG',
    priority: 'Medium',
    due: '',
    assignee: 'Unassigned'
  });

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.TASKS, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenForm = (task?: any) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        title: task.title || '',
        project: task.project || '',
        category: task.category || 'Poster',
        status: task.status || 'BACKLOG',
        priority: task.priority || 'Medium',
        due: task.due || '',
        assignee: task.assignee || 'Unassigned'
      });
    } else {
      setEditingId(null);
      setFormData({ title: '', project: '', category: 'Poster', status: 'BACKLOG', priority: 'Medium', due: '', assignee: 'Unassigned' });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = async () => {
    if (!formData.title.trim()) return;
    try {
      if (editingId) {
        await dbService.update(Collections.TASKS, editingId, formData);
      } else {
        await dbService.create(Collections.TASKS, formData);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const handleDelete = async () => {
    if (deletingTask) {
      try {
        await dbService.delete(Collections.TASKS, deletingTask.id);
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.project?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tasks-container">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Track all production tasks and their statuses.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
           Loading tasks...
        </div>
      ) : filteredTasks.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
           <ListTodo size={48} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
           <h3>No tasks found</h3>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Create your first task to get started.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {filteredTasks.map((task) => (
            <div className="task-card glass-panel" key={task.id}>
              <div className="task-card-header">
                <div className="task-category-icon">
                  {getCategoryIcon(task.category)}
                </div>
                <span className={`task-priority priority-${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </span>
                <div className="ms-auto">
                  <ActionMenu 
                    onEdit={() => handleOpenForm(task)}
                    onDelete={() => {
                      setDeletingTask({ id: task.id, title: task.title });
                      setIsDeleteOpen(true);
                    }}
                  />
                </div>
              </div>
              
              <div className="task-card-body">
                <h3 className="task-title">{task.title}</h3>
                <p className="task-project">{task.project}</p>
              </div>
              
              <div className="task-card-footer">
                <div className="task-meta">
                  <span className={`status-badge status-${task.status?.toLowerCase()}`}>
                    {task.status?.replace('_', ' ')}
                  </span>
                  <span className="task-due">Due: {task.due}</span>
                </div>
                <div className="task-assignee">
                  {task.assignee !== 'Unassigned' ? (
                    <div className="avatar-small">{task.assignee?.substring(0, 2).toUpperCase()}</div>
                  ) : (
                    <span className="unassigned-text">Unassigned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forms & Modals */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Task" : "New Task"}>
        <div className="modal-form-group">
          <label>Task Title</label>
          <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Design Homepage" />
        </div>
        <div className="modal-form-group">
          <label>Project</label>
          <input type="text" value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} placeholder="e.g. Website Redesign" />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label>Category</label>
            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option value="Poster">Poster</option>
              <option value="Video">Video</option>
              <option value="Website">Website</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label>Priority</label>
            <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label>Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="BACKLOG">Backlog</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="REVIEW">Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label>Due Date</label>
            <input type="date" value={formData.due} onChange={e => setFormData({...formData, due: e.target.value})} />
          </div>
        </div>
        <div className="modal-form-group">
          <label>Assignee</label>
          <input type="text" value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} placeholder="e.g. John Doe" />
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSaveForm}>Save Task</button>
        </div>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={deletingTask?.title || 'this task'}
      />
    </div>
  );
};

export default Tasks;
