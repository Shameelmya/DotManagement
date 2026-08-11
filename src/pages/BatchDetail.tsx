import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, LayoutDashboard, Users, 
  DollarSign, Calendar, Edit 
} from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './BatchDetail.css';

const BatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      const fetchBatch = async () => {
        try {
          const data = await dbService.getOne(Collections.BATCHES, id);
          if (data) {
            setBatch(data);
          } else {
            navigate('/courses');
          }
        } catch (error) {
          console.error("Error fetching batch:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBatch();
    }
  }, [id, navigate]);

  if (loading) {
    return <div className="loading-state">Loading batch details...</div>;
  }

  if (!batch) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="tab-pane">
            <div className="detail-card glass-panel">
              <h3>Batch Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Course</span>
                  <span className="value">{batch.courseName || 'Unknown Course'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status</span>
                  <span className={`status-badge status-${batch.status?.toLowerCase() || 'active'}`}>
                    {batch.status || 'Active'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Trainer</span>
                  <span className="value">{batch.trainer || 'Unassigned'}</span>
                </div>
                <div className="info-item">
                  <span className="label">Schedule</span>
                  <span className="value">{batch.schedule || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'students':
        return <div className="tab-pane">Students Module Coming (Manage enrollments)</div>;
      case 'finance':
        return <div className="tab-pane">Finance Module Coming (Track fee payments)</div>;
      default:
        return null;
    }
  };

  return (
    <div className="page-container batch-detail-page">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-icon" onClick={() => navigate('/courses')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>{batch.name}</h1>
            <p>Manage students, schedule, and fees for this batch.</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-secondary">
            <Edit size={18} />
            <span>Edit Batch</span>
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
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          <Users size={18} /> Students
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

export default BatchDetail;
