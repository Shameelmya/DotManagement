import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Mail, Phone, Shield, Users } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './Staff.css';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.STAFF, (data) => {
      setStaffList(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredStaff = staffList.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="staff-container">
      <div className="page-header">
        <div>
          <h1>Staff Directory</h1>
          <p>Manage team members, roles, and access.</p>
        </div>
        <button className="btn-primary" onClick={() => {
            const name = prompt("Enter staff name:");
            const email = prompt("Enter staff email:");
            if (name && email) {
                dbService.create(Collections.STAFF, {
                    name,
                    email,
                    role: 'STAFF',
                    designation: 'New Employee',
                    phone: 'N/A',
                    status: 'ACTIVE'
                });
            }
        }}>
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

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
           Loading staff directory...
        </div>
      ) : filteredStaff.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
           <Users size={48} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
           <h3>No staff found</h3>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Add team members to get started.</p>
        </div>
      ) : (
        <div className="staff-grid">
          {filteredStaff.map((staff) => (
            <div className="staff-card glass-panel" key={staff.id}>
              <div className="staff-card-header">
                <div className="staff-avatar">{staff.name?.substring(0, 2).toUpperCase()}</div>
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
                <span className={`status-badge status-${staff.status?.toLowerCase()}`}>
                  {staff.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Staff;
