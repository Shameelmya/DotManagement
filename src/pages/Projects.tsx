import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Building2, FolderKanban } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import { Modal } from '../components/ui/Modal';
import { ActionMenu } from '../components/ui/ActionMenu';
import { ConfirmDeleteModal } from '../components/ui/ConfirmDeleteModal';
import './Projects.css';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<{id: string, name: string} | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    status: 'PENDING',
    value: 0,
    received: 0,
    deadline: ''
  });

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.PROJECTS, (data) => {
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenForm = (project?: any) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        name: project.name || '',
        client: project.client || '',
        status: project.status || 'PENDING',
        value: project.value || 0,
        received: project.received || 0,
        deadline: project.deadline || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', client: '', status: 'PENDING', value: 0, received: 0, deadline: '' });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = async () => {
    if (!formData.name.trim()) return;
    try {
      if (editingId) {
        await dbService.update(Collections.PROJECTS, editingId, formData);
      } else {
        await dbService.create(Collections.PROJECTS, formData);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save project", err);
    }
  };

  const handleDelete = async () => {
    if (deletingProject) {
      try {
        await dbService.delete(Collections.PROJECTS, deletingProject.id);
      } catch (err) {
        console.error("Failed to delete project", err);
      }
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.client?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-container">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage active and completed projects.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenForm()}>
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search projects or clients..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          <span>Status</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
           Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
           <FolderKanban size={48} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
           <h3>No projects found</h3>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Create your first project to get started.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Value</th>
                  <th>Received</th>
                  <th>Outstanding</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const val = project.value || 0;
                  const rec = project.received || 0;
                  const outstanding = val - rec;
                  return (
                    <tr key={project.id}>
                      <td className="fw-600">{project.name}</td>
                      <td>
                        <div className="client-cell">
                          <Building2 size={14} className="text-muted"/>
                          {project.client}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge status-${project.status?.toLowerCase()}`}>
                          {project.status?.replace('_', ' ')}
                        </span>
                      </td>
                      <td>₹{val.toLocaleString()}</td>
                      <td className="text-success">₹{rec.toLocaleString()}</td>
                      <td className={outstanding > 0 ? 'text-warning fw-600' : 'text-success fw-600'}>
                        ₹{outstanding.toLocaleString()}
                      </td>
                      <td>{project.deadline}</td>
                      <td>
                        <ActionMenu 
                          onEdit={() => handleOpenForm(project)}
                          onDelete={() => {
                            setDeletingProject({ id: project.id, name: project.name });
                            setIsDeleteOpen(true);
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="projects-cards-container">
            {filteredProjects.map((project) => {
              const val = project.value || 0;
              const rec = project.received || 0;
              const outstanding = val - rec;
              return (
                <div className="project-card" key={project.id}>
                  <div className="project-card-header">
                    <h3 className="project-title">{project.name}</h3>
                    <ActionMenu 
                      onEdit={() => handleOpenForm(project)}
                      onDelete={() => {
                        setDeletingProject({ id: project.id, name: project.name });
                        setIsDeleteOpen(true);
                      }}
                    />
                  </div>
                  
                  <div className="project-client">
                    <Building2 size={14} className="text-muted"/>
                    <span>{project.client}</span>
                  </div>
                  
                  <div className="project-financials">
                    <div className="fin-item">
                      <span className="fin-label">Value</span>
                      <span className="fin-value">₹{val.toLocaleString()}</span>
                    </div>
                    <div className="fin-item">
                      <span className="fin-label">Received</span>
                      <span className="fin-value text-success">₹{rec.toLocaleString()}</span>
                    </div>
                    <div className="fin-item">
                      <span className="fin-label">Outstanding</span>
                      <span className={`fin-value ${outstanding > 0 ? 'text-warning' : 'text-success'}`}>
                        ₹{outstanding.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="project-card-footer">
                    <span className={`status-badge status-${project.status?.toLowerCase()}`}>
                      {project.status?.replace('_', ' ')}
                    </span>
                    <span className="project-deadline">Due: {project.deadline}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Forms & Modals */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Project" : "New Project"}>
        <div className="modal-form-group">
          <label>Project Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Website Redesign" />
        </div>
        <div className="modal-form-group">
          <label>Client</label>
          <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="e.g. Acme Corp" />
        </div>
        <div className="modal-form-group">
          <label>Status</label>
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="modal-form-group">
          <label>Total Value (₹)</label>
          <input type="number" value={formData.value} onChange={e => setFormData({...formData, value: Number(e.target.value)})} />
        </div>
        <div className="modal-form-group">
          <label>Amount Received (₹)</label>
          <input type="number" value={formData.received} onChange={e => setFormData({...formData, received: Number(e.target.value)})} />
        </div>
        <div className="modal-form-group">
          <label>Deadline</label>
          <input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSaveForm}>Save Project</button>
        </div>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={deletingProject?.name || 'this project'}
      />
    </div>
  );
};

export default Projects;
