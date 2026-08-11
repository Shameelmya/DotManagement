import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './MainLayout.css';
import { Home, Briefcase, IndianRupee, Users, Menu, CheckSquare, BookOpen, LogOut, Settings, ShieldAlert, DatabaseBackup } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const MainLayout = () => {
  const logout = useAuthStore(state => state.logout);

  return (
    <div className="main-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/logo.png" alt="Dot Projects" style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => e.currentTarget.style.display='none'}/>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>Dot Projects</span>
        </div>
        <div className="header-actions">
          <button className="btn-icon" onClick={logout} title="Logout" style={{ marginRight: '8px' }}>
            <LogOut size={20} className="text-error" />
          </button>
          <Menu className="icon" />
        </div>
      </header>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="desktop-sidebar">
        <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Dot Projects" style={{ height: '40px', width: '40px', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => e.currentTarget.style.display='none'}/>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--color-text-main)', letterSpacing: '-0.5px' }}>Dot Projects</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN</div>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Home className="icon"/> Dashboard</NavLink>
          
          <div className="nav-section-title">WORK</div>
          <NavLink to="/work/projects" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Briefcase className="icon"/> Projects</NavLink>
          <NavLink to="/work/tasks" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><CheckSquare className="icon"/> Tasks</NavLink>
          
          <div className="nav-section-title">TEAM</div>
          <NavLink to="/team" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Users className="icon"/> Staff & Team</NavLink>
          <NavLink to="/courses" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><BookOpen className="icon"/> Courses</NavLink>
          
          <div className="nav-section-title">SYSTEM</div>
          <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Settings className="icon"/> Settings</NavLink>
          <NavLink to="/audit" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><ShieldAlert className="icon"/> Audit Logs</NavLink>
          <NavLink to="/backup" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><DatabaseBackup className="icon"/> Backup & Restore</NavLink>
          
          <div className="nav-section-title">FINANCE</div>
          <NavLink to="/finance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><IndianRupee className="icon"/> Overview</NavLink>
        </nav>
        
        <div style={{ padding: '20px', marginTop: 'auto' }}>
          <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', color: 'var(--color-error)', borderColor: 'var(--color-error)' }} onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/work/projects" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-wrapper"><Briefcase className="icon" /></div>
          <span>Work</span>
        </NavLink>
        <NavLink to="/finance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-wrapper"><IndianRupee className="icon" /></div>
          <span>Finance</span>
        </NavLink>
        
        {/* Center Floating Action Button Style for Home */}
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active center-fab" : "nav-item center-fab"}>
          <div className="icon-wrapper"><Home className="icon" /></div>
          <span>Home</span>
        </NavLink>

        <NavLink to="/team" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-wrapper"><Users className="icon" /></div>
          <span>Team</span>
        </NavLink>
        <NavLink to="/more" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div className="icon-wrapper"><Menu className="icon" /></div>
          <span>More</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainLayout;
