import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Briefcase, CheckSquare, DollarSign, Activity, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const user = useAuthStore(state => state.user);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Good Morning, {user?.email?.split('@')[0] || 'User'}</h1>
        <p className="dashboard-subtitle">Here is what's happening today.</p>
      </header>

      {/* Priority Action Area for Mobile */}
      <section className="priority-section">
        <h3>Today's Priority</h3>
        <div className="priority-cards">
          <div className="priority-card pending">
            <span className="count">4</span>
            <span className="label">Tasks</span>
          </div>
          <div className="priority-card running">
            <span className="count">2</span>
            <span className="label">Running</span>
          </div>
          <div className="priority-card review">
            <span className="count">1</span>
            <span className="label">Review</span>
          </div>
          <div className="priority-card overdue">
            <span className="count">1</span>
            <span className="label">Overdue</span>
          </div>
        </div>
      </section>

      {/* KPI Overview */}
      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <Briefcase className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Projects</span>
            <span className="kpi-value">12</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper green">
            <CheckSquare className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Completed Tasks</span>
            <span className="kpi-value">48</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper amber">
            <DollarSign className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Receivables</span>
            <span className="kpi-value">₹45,000</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper pink">
            <Activity className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Net Position</span>
            <span className="kpi-value">₹1,20,500</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        <section className="dashboard-panel">
          <div className="panel-header">
            <h3>Recent Updates</h3>
            <button className="btn-text">View All</button>
          </div>
          <div className="panel-content">
            <div className="activity-item">
              <div className="activity-icon blue"><CheckSquare size={16}/></div>
              <div className="activity-details">
                <p><strong>Techcon Poster</strong> marked as Review</p>
                <span>10 mins ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon green"><DollarSign size={16}/></div>
              <div className="activity-details">
                <p>Payment received for <strong>Web Design Pro</strong></p>
                <span>2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon amber"><AlertCircle size={16}/></div>
              <div className="activity-details">
                <p><strong>Brand Guide</strong> task is overdue</p>
                <span>5 hours ago</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-header">
            <h3>Team Workload</h3>
          </div>
          <div className="panel-content workload-list">
            <div className="workload-item">
              <div className="user-info">
                <div className="avatar">JD</div>
                <span>John Doe</span>
              </div>
              <div className="workload-bar-container">
                <div className="workload-bar" style={{ width: '80%' }}></div>
              </div>
              <span className="workload-count">8 tasks</span>
            </div>
            <div className="workload-item">
              <div className="user-info">
                <div className="avatar">SA</div>
                <span>Sarah Admin</span>
              </div>
              <div className="workload-bar-container">
                <div className="workload-bar" style={{ width: '40%' }}></div>
              </div>
              <span className="workload-count">4 tasks</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
