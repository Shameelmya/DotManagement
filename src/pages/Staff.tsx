import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Mail, Phone, Shield, Users } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import { Modal } from '../components/ui/Modal';
import { ActionMenu } from '../components/ui/ActionMenu';
import { ConfirmDeleteModal } from '../components/ui/ConfirmDeleteModal';
import './Staff.css';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<{id: string, name: string} | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    role: 'STAFF',
    status: 'ACTIVE'
  });

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.STAFF, (data) => {
      setStaffList(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenForm = (staff?: any) => {
    if (staff) {
      setEditingId(staff.id);
      setFormData({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        designation: staff.designation || '',
        role: staff.role || 'STAFF',
        status: staff.status || 'ACTIVE'
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', email: '', phone: '', designation: '', role: 'STAFF', status: 'ACTIVE' });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = async () => {
    if (!formData.name.trim() || !formData.email.trim()) return;
    try {
      if (editingId) {
        await dbService.update(Collections.STAFF, editingId, formData);
      } else {
        await dbService.create(Collections.STAFF, formData);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save staff member", err);
    }
  };

  const handleDelete = async () => {
    if (deletingStaff) {
      try {
        await dbService.delete(Collections.STAFF, deletingStaff.id);
      } catch (err) {
        console.error("Failed to delete staff member", err);
      }
    }
  };

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
        <button className="btn-primary" onClick={() => handleOpenForm()}>
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
                <div className="ms-auto">
                  <ActionMenu 
                    onEdit={() => handleOpenForm(staff)}
                    onDelete={() => {
                      setDeletingStaff({ id: staff.id, name: staff.name });
                      setIsDeleteOpen(true);
                    }}
                  />
                </div>
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
                    <span>{staff.phone || 'N/A'}</span>
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

      {/* Forms & Modals */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Staff Member" : "Add Staff Member"}>
        <div className="modal-form-group">
          <label>Full Name</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sarah Smith" />
        </div>
        <div className="modal-form-group">
          <label>Email Address</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="e.g. sarah@dotprojects.com" />
        </div>
        <div className="modal-form-group">
          <label>Phone Number</label>
          <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="e.g. +91 98765 43210" />
        </div>
        <div className="modal-form-group">
          <label>Designation / Job Title</label>
          <input type="text" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} placeholder="e.g. Senior UI Designer" />
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label>System Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="STAFF">Staff (Standard)</option>
              <option value="MANAGER">Manager</option>
              <option value="FINANCE">Finance</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <div className="modal-form-group" style={{ flex: 1 }}>
            <label>Account Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSaveForm}>Save Staff Member</button>
        </div>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={deletingStaff?.name || 'this staff member'}
      />
    </div>
  );
};

export default Staff;
