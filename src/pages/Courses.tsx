import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Users, Calendar, MoreVertical, Library } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './Courses.css';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.COURSES, (data) => {
      setCourses(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="courses-container">
      <div className="page-header">
        <div>
          <h1>Courses & Training</h1>
          <p>Manage curriculum, batches, and student enrollments.</p>
        </div>
        <button className="btn-primary" onClick={() => {
            const name = prompt("Enter course name:");
            if (name) {
                dbService.create(Collections.COURSES, {
                    name,
                    duration: '8 Weeks',
                    fee: 25000,
                    status: 'PLANNED',
                    batches: 0,
                    students: 0
                });
            }
        }}>
          <Plus size={20} />
          <span>New Course</span>
        </button>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          <span>Status</span>
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
           Loading courses...
        </div>
      ) : filteredCourses.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)' }}>
           <Library size={48} style={{ color: 'var(--color-border)', marginBottom: '16px' }} />
           <h3>No courses found</h3>
           <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>Create your first course to get started.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {filteredCourses.map((course) => (
            <div className="course-card glass-panel" key={course.id}>
              <div className="course-card-header">
                <div className="course-icon-wrapper">
                  <BookOpen size={24} />
                </div>
                <button className="btn-icon"><MoreVertical size={16}/></button>
              </div>
              
              <div className="course-card-body">
                <h3 className="course-title">{course.name}</h3>
                <div className="course-tags">
                  <span className="course-tag">{course.duration}</span>
                  <span className="course-tag highlight">₹{Number(course.fee || 0).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="course-stats">
                <div className="stat-item">
                  <Calendar size={14} className="text-muted" />
                  <span>{course.batches} Batches</span>
                </div>
                <div className="stat-item">
                  <Users size={14} className="text-muted" />
                  <span>{course.students} Students</span>
                </div>
              </div>
              
              <div className="course-card-footer">
                <span className={`status-badge status-${course.status?.toLowerCase()}`}>
                  {course.status}
                </span>
                <button className="btn-text" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>Manage Batches</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
