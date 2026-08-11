import React from 'react';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';
import './Reports.css';

const Reports = () => {
  return (
    <div className="page-container reports-page">
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>View detailed insights into production and revenue.</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card glass-panel">
          <div className="report-header">
            <div className="icon-wrapper primary"><TrendingUp size={20} /></div>
            <h3>Financial Overview</h3>
          </div>
          <p className="text-muted">Analyze income vs expenses across projects and batches.</p>
          <button className="btn-secondary mt-4">View Report</button>
        </div>
        
        <div className="report-card glass-panel">
          <div className="report-header">
            <div className="icon-wrapper success"><BarChart3 size={20} /></div>
            <h3>Project Production</h3>
          </div>
          <p className="text-muted">Track completed tasks and production value over time.</p>
          <button className="btn-secondary mt-4">View Report</button>
        </div>

        <div className="report-card glass-panel">
          <div className="report-header">
            <div className="icon-wrapper warning"><Users size={20} /></div>
            <h3>Staff Performance</h3>
          </div>
          <p className="text-muted">Evaluate team workload and completion metrics.</p>
          <button className="btn-secondary mt-4">View Report</button>
        </div>

        <div className="report-card glass-panel">
          <div className="report-header">
            <div className="icon-wrapper danger"><BookOpen size={20} /></div>
            <h3>Course Revenue</h3>
          </div>
          <p className="text-muted">Analyze batch enrollments and fee collection status.</p>
          <button className="btn-secondary mt-4">View Report</button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
