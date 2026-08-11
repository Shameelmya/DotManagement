import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LayoutDashboard, CheckSquare, Users, 
  DollarSign, FileText, Activity, Edit, Trash2 
} from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const data = await dbService.getOne(Collections.PROJECTS, id);
          if (data) {
            setProject(data);
          } else {
            navigate('/projects');
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-state">Loading project details...</div>;
  }

  if (!project) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-pane">
            <div className="detail-card glass-panel">
              <h3>Project Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Client</span>
                  <span className="value">{project.client}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status</span>
                  <span className={`status-badge status-${project.status.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Value</span>
                  <span className="value">${project.value?.toLocaleString() || 0}</span>
                </div>
                <div className="info-item">
                  <span className="label">Deadline</span>
                  <span className="value">{project.deadline || 'Not set'}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <h4>Description</h4>
                <p className="text-muted">{project.description || 'No description provided.'}</p>
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return <div className="tab-pane">Tasks Module Coming (Will integrate Task list here)</div>;
      case 'team':
        return <div className="tab-pane">Team Module Coming (Will show assigned staff)</div>;
      case 'finance':
        return <div className="tab-pane">Finance Module Coming (Will show project-specific payments and expenses)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="page-container project-detail-page">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/projects')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{project.name}</h1>
            <p>Manage project details, tasks, and finances.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Edit size={18} />
            <span>Edit Project</span>
          </button>
        </div>
      </div>

      <div className="detail-tabs glass-panel">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <LayoutDashboard size={18} /> Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={18} /> Tasks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          <Users size={18} /> Team
        </button>
        <button 
          className={`tab-btn ${activeTab === 'finance' ? 'active' : ''}`}
          onClick={() => setActiveTab('finance')}
        >
          <DollarSign size={18} /> Finance
        </button>
      </div>

      <div className="detail-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProjectDetail;
