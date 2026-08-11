import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Building2, FolderKanban } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './Projects.css';

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.PROJECTS, (data) => {
      setProjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        <button className="btn-primary" onClick={() => {
            // Placeholder: open create project modal
            const name = prompt("Enter project name:");
            if (name) {
                dbService.create(Collections.PROJECTS, {
                    name,
                    client: 'New Client',
                    status: 'PENDING',
                    value: 0,
                    received: 0,
                    deadline: 'TBD'
                });
            }
        }}>
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
          {/* Desktop Table View (hidden on mobile) */}
          <div className="projects-table-container">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Value</th>
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
                      <td className={outstanding > 0 ? 'text-warning fw-600' : 'text-success fw-600'}>
                        ₹{outstanding.toLocaleString()}
                      </td>
                      <td>{project.deadline}</td>
                      <td>
                        <button className="btn-icon"><MoreVertical size={16}/></button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (hidden on desktop) */}
          <div className="projects-cards-container">
            {filteredProjects.map((project) => {
              const val = project.value || 0;
              const rec = project.received || 0;
              const outstanding = val - rec;
              return (
                <div className="project-card" key={project.id}>
                  <div className="project-card-header">
                    <h3 className="project-title">{project.name}</h3>
                    <button className="btn-icon"><MoreVertical size={16}/></button>
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
    </div>
  );
};

export default Projects;
