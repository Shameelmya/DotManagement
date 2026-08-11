import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './MainLayout.css';
import { Home, Briefcase, DollarSign, Users, Menu, CheckSquare, BookOpen } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <div className="logo-container">
          <img src="/logo.png" alt="Dot Projects" style={{ height: '32px', width: 'auto' }} onError={(e) => e.currentTarget.style.display='none'}/>
        </div>
        <div className="header-actions">
          <Menu className="icon" />
        </div>
      </header>

      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="desktop-sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Dot Projects" style={{ height: '40px', width: 'auto' }} onError={(e) => e.currentTarget.style.display='none'}/>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN</div>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Home className="icon"/> Dashboard</NavLink>
          
          <div className="nav-section-title">WORK</div>
          <NavLink to="/work/projects" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Briefcase className="icon"/> Projects</NavLink>
          <NavLink to="/work/tasks" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><CheckSquare className="icon"/> Tasks</NavLink>
          
          <div className="nav-section-title">TEAM</div>
          <NavLink to="/team" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><Users className="icon"/> Staff</NavLink>
          
          <div className="nav-section-title">COURSES</div>
          <NavLink to="/courses" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><BookOpen className="icon"/> Courses</NavLink>
          
          <div className="nav-section-title">FINANCE</div>
          <NavLink to="/finance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}><DollarSign className="icon"/> Overview</NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Home className="icon" />
          <span>Home</span>
        </NavLink>
        <NavLink to="/work/projects" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Briefcase className="icon" />
          <span>Work</span>
        </NavLink>
        <NavLink to="/finance" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <DollarSign className="icon" />
          <span>Finance</span>
        </NavLink>
        <NavLink to="/team" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Users className="icon" />
          <span>Team</span>
        </NavLink>
        <NavLink to="/more" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Menu className="icon" />
          <span>More</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default MainLayout;
