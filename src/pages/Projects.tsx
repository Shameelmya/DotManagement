import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Briefcase } from 'lucide-react';
import './Projects.css';

const DUMMY_PROJECTS = [
  { id: 'PRJ-101', name: 'Techcon Branding', client: 'Techcon Corp', status: 'RUNNING', deadline: '2026-09-15', value: '₹1,50,000', outstanding: '₹50,000' },
  { id: 'PRJ-102', name: 'Web Design Pro', client: 'Web Solutions', status: 'COMPLETED', deadline: '2026-08-01', value: '₹80,000', outstanding: '₹0' },
  { id: 'PRJ-103', name: 'Social Media Q3', client: 'Local Cafe', status: 'RUNNING', deadline: '2026-10-01', value: '₹45,000', outstanding: '₹20,000' },
  { id: 'PRJ-104', name: 'Annual Report', client: 'Finance Inc', status: 'PLANNED', deadline: '2026-11-20', value: '₹95,000', outstanding: '₹95,000' },
];

const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="projects-container">
      <div className="page-header">
        <div>
          <h1>Projects</h1>
          <p>Manage all client projects and retainers.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search projects by name or client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="projects-table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Deadline</th>
              <th>Value</th>
              <th>Outstanding</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {DUMMY_PROJECTS.map((prj) => (
              <tr key={prj.id}>
                <td>
                  <div className="prj-name-cell">
                    <Briefcase size={16} className="text-muted" />
                    <div>
                      <strong>{prj.name}</strong>
                      <span className="prj-id">{prj.id}</span>
                    </div>
                  </div>
                </td>
                <td>{prj.client}</td>
                <td>
                  <span className={`status-badge status-${prj.status.toLowerCase()}`}>
                    {prj.status}
                  </span>
                </td>
                <td>{prj.deadline}</td>
                <td>{prj.value}</td>
                <td className={prj.outstanding !== '₹0' ? 'text-amber' : 'text-success'}>
                  {prj.outstanding}
                </td>
                <td>
                  <button className="btn-icon"><MoreVertical size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="projects-mobile-list">
        {DUMMY_PROJECTS.map((prj) => (
          <div className="project-card" key={prj.id}>
            <div className="project-card-header">
              <div className="prj-name-cell">
                <Briefcase size={18} className="text-primary" />
                <div>
                  <strong>{prj.name}</strong>
                  <span className="prj-id">{prj.id}</span>
                </div>
              </div>
              <button className="btn-icon"><MoreVertical size={18}/></button>
            </div>
            
            <div className="project-card-body">
              <div className="detail-row">
                <span className="label">Client</span>
                <span className="value">{prj.client}</span>
              </div>
              <div className="detail-row">
                <span className="label">Deadline</span>
                <span className="value">{prj.deadline}</span>
              </div>
              <div className="detail-row">
                <span className="label">Outstanding</span>
                <span className={`value ${prj.outstanding !== '₹0' ? 'text-amber' : 'text-success'}`}>
                  {prj.outstanding}
                </span>
              </div>
            </div>
            
            <div className="project-card-footer">
              <span className={`status-badge status-${prj.status.toLowerCase()}`}>
                {prj.status}
              </span>
              <button className="btn-text">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
