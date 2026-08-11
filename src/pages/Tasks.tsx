import React, { useState } from 'react';
import { Plus, Search, Filter, Image, Video, Monitor, MoreVertical } from 'lucide-react';
import './Tasks.css';

const DUMMY_TASKS = [
  { id: 'TSK-201', title: 'Techcon Poster', project: 'Techcon Branding', category: 'Poster', status: 'IN_PROGRESS', priority: 'High', due: 'Today', assignee: 'JD' },
  { id: 'TSK-202', title: 'Promo Video Q3', project: 'Social Media Q3', category: 'Video', status: 'REVIEW', priority: 'Medium', due: 'Tomorrow', assignee: 'SA' },
  { id: 'TSK-203', title: 'Landing Page UI', project: 'Web Design Pro', category: 'Website', status: 'COMPLETED', priority: 'High', due: '2026-07-20', assignee: 'MK' },
  { id: 'TSK-204', title: 'Annual Report Layout', project: 'Annual Report', category: 'Graphic Design', status: 'BACKLOG', priority: 'Low', due: '2026-11-15', assignee: 'Unassigned' },
];

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

  return (
    <div className="tasks-container">
      <div className="page-header">
        <div>
          <h1>Tasks</h1>
          <p>Track all production tasks and their statuses.</p>
        </div>
        <button className="btn-primary">
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

      {/* Task Board / Grid for Desktop */}
      <div className="tasks-grid">
        {DUMMY_TASKS.map((task) => (
          <div className="task-card" key={task.id}>
            <div className="task-card-header">
              <div className="task-category-icon">
                {getCategoryIcon(task.category)}
              </div>
              <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
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
                <span className={`status-badge status-${task.status.toLowerCase()}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <span className="task-due">Due: {task.due}</span>
              </div>
              <div className="task-assignee">
                {task.assignee !== 'Unassigned' ? (
                  <div className="avatar-small">{task.assignee}</div>
                ) : (
                  <span className="unassigned-text">Unassigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
