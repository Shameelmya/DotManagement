import React, { useState } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Shield } from 'lucide-react';
import './Staff.css';

const DUMMY_STAFF = [
  { id: 'STF-001', name: 'John Doe', role: 'SUPER_ADMIN', designation: 'Director', email: 'john@dotprojects.com', phone: '+91 9876543210', status: 'ACTIVE' },
  { id: 'STF-002', name: 'Sarah Admin', role: 'ADMIN', designation: 'Project Manager', email: 'sarah@dotprojects.com', phone: '+91 9876543211', status: 'ACTIVE' },
  { id: 'STF-003', name: 'Mike K.', role: 'STAFF', designation: 'Senior Designer', email: 'mike@dotprojects.com', phone: '+91 9876543212', status: 'ACTIVE' },
  { id: 'STF-004', name: 'Emma W.', role: 'FINANCE', designation: 'Accountant', email: 'emma@dotprojects.com', phone: '+91 9876543213', status: 'INACTIVE' },
];

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="staff-container">
      <div className="page-header">
        <div>
          <h1>Staff Directory</h1>
          <p>Manage team members, roles, and access.</p>
        </div>
        <button className="btn-primary">
          <Plus size={20} />
          <span>Add Staff</span>
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          <span>Role</span>
        </button>
      </div>

      <div className="staff-grid">
        {DUMMY_STAFF.map((staff) => (
          <div className="staff-card" key={staff.id}>
            <div className="staff-card-header">
              <div className="staff-avatar">{staff.name.substring(0, 2).toUpperCase()}</div>
              <button className="btn-icon"><MoreVertical size={16}/></button>
            </div>
            
            <div className="staff-card-body">
              <h3 className="staff-name">{staff.name}</h3>
              <p className="staff-designation">{staff.designation}</p>
              
              <div className="staff-contact">
                <div className="contact-item">
                  <Mail size={14} className="text-muted"/>
                  <span>{staff.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={14} className="text-muted"/>
                  <span>{staff.phone}</span>
                </div>
              </div>
            </div>
            
            <div className="staff-card-footer">
              <span className="role-badge">
                <Shield size={12}/>
                {staff.role}
              </span>
              <span className={`status-badge status-${staff.status.toLowerCase()}`}>
                {staff.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Staff;
