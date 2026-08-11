import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, PieChart, Settings, Shield, HardDrive, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import './More.css';

const More = () => {
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="more-container">
      <div className="page-header">
        <h1>More</h1>
      </div>

      <div className="more-menu-list">
        <NavLink to="/courses" className="more-menu-item">
          <BookOpen className="icon text-primary" />
          <div className="item-text">
            <h4>Courses & Batches</h4>
            <p>Manage academy training</p>
          </div>
        </NavLink>

        <NavLink to="/reports" className="more-menu-item">
          <PieChart className="icon text-info" />
          <div className="item-text">
            <h4>Reports</h4>
            <p>View analytics and exports</p>
          </div>
        </NavLink>

        <NavLink to="/settings" className="more-menu-item">
          <Settings className="icon text-muted" />
          <div className="item-text">
            <h4>Settings</h4>
            <p>System configuration</p>
          </div>
        </NavLink>

        <div className="more-menu-divider"></div>

        <NavLink to="/audit" className="more-menu-item">
          <Shield className="icon text-warning" />
          <div className="item-text">
            <h4>Audit Logs</h4>
            <p>System activity history</p>
          </div>
        </NavLink>

        <NavLink to="/backup" className="more-menu-item">
          <HardDrive className="icon text-success" />
          <div className="item-text">
            <h4>Backup & Restore</h4>
            <p>Data management</p>
          </div>
        </NavLink>

        <div className="more-menu-divider"></div>

        <div className="more-menu-item" onClick={logout} style={{ cursor: 'pointer' }}>
          <LogOut className="icon text-error" />
          <div className="item-text">
            <h4 className="text-error">Logout</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default More;
