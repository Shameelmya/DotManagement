import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Briefcase, CheckSquare, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './Dashboard.css';

const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
    netPosition: 0,
    receivables: 0,
    workload: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We are simulating aggregation by fetching all docs.
    // In a production environment with millions of rows, use Firestore Aggregation Queries.
    const loadData = async () => {
      try {
        const [projects, tasks, finance, staff] = await Promise.all([
          dbService.getAll(Collections.PROJECTS) as Promise<any[]>,
          dbService.getAll(Collections.TASKS) as Promise<any[]>,
          dbService.getAll(Collections.FINANCE) as Promise<any[]>,
          dbService.getAll(Collections.STAFF) as Promise<any[]>
        ]);

        const totalIncome = finance.filter(t => t.type === 'in').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        const totalExpense = finance.filter(t => t.type === 'out').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
        
        // Calculate receivables from projects
        const receivables = projects.reduce((sum, p) => sum + (Math.max(0, (Number(p.value) || 0) - (Number(p.received) || 0))), 0);

        // Workload mapping
        const workloadMap: Record<string, number> = {};
        tasks.forEach(t => {
            if (t.assignee && t.assignee !== 'Unassigned' && t.status !== 'COMPLETED') {
                workloadMap[t.assignee] = (workloadMap[t.assignee] || 0) + 1;
            }
        });
        const workload = Object.keys(workloadMap).map(name => ({ name, count: workloadMap[name] })).sort((a,b) => b.count - a.count);

        setStats({
          projects: projects.filter(p => p.status !== 'COMPLETED').length,
          tasks: tasks.length,
          completedTasks: tasks.filter(t => t.status === 'COMPLETED').length,
          netPosition: totalIncome - totalExpense,
          receivables,
          workload
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Good Morning, {user?.email?.split('@')[0] || 'User'}</h1>
        <p className="dashboard-subtitle">Here is what's happening today.</p>
      </header>

      {/* KPI Overview */}
      <section className="kpi-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper blue">
            <Briefcase className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Active Projects</span>
            <span className="kpi-value">{loading ? '...' : stats.projects}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper green">
            <CheckSquare className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Completed Tasks</span>
            <span className="kpi-value">{loading ? '...' : stats.completedTasks}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper amber">
            <DollarSign className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Receivables</span>
            <span className="kpi-value">{loading ? '...' : `₹${stats.receivables.toLocaleString()}`}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon-wrapper pink">
            <Activity className="icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Net Position</span>
            <span className="kpi-value">{loading ? '...' : `₹${stats.netPosition.toLocaleString()}`}</span>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="dashboard-main-grid">
        <section className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>Recent Updates</h3>
            <button className="btn-text" style={{ color: 'var(--color-primary)'}}>View All</button>
          </div>
          <div className="panel-content">
            <div className="activity-item">
              <div className="activity-icon blue"><CheckSquare size={16}/></div>
              <div className="activity-details">
                <p>Welcome to the new system!</p>
                <span>Just now</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-panel glass-panel">
          <div className="panel-header">
            <h3>Team Workload</h3>
          </div>
          <div className="panel-content workload-list">
            {loading ? (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>Loading...</div>
            ) : stats.workload.length === 0 ? (
                <div style={{ color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px' }}>No active workloads.</div>
            ) : (
                stats.workload.map(wl => (
                    <div className="workload-item" key={wl.name}>
                      <div className="user-info">
                        <div className="avatar">{wl.name.substring(0, 2).toUpperCase()}</div>
                        <span>{wl.name}</span>
                      </div>
                      <div className="workload-bar-container">
                        <div className="workload-bar" style={{ width: `${Math.min(100, wl.count * 10)}%` }}></div>
                      </div>
                      <span className="workload-count">{wl.count} tasks</span>
                    </div>
                ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
