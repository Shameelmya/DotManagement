import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Image, Video, Monitor, MoreVertical, ListTodo } from 'lucide-react';
import { dbService, Collections } from '../services/db';
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

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.TASKS, (data) => {
      setTasks(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        <button className="btn-primary" onClick={() => {
            const title = prompt("Enter task title:");
            if (title) {
                dbService.create(Collections.TASKS, {
                    title,
                    project: 'General',
                    category: 'Poster',
                    status: 'BACKLOG',
                    priority: 'Medium',
                    due: 'TBD',
                    assignee: 'Unassigned'
                });
            }
        }}>
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
                <button className="btn-icon ms-auto"><MoreVertical size={16}/></button>
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
    </div>
  );
};

export default Tasks;
