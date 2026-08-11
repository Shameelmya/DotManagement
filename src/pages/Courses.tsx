import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen, Users, Calendar, MoreVertical } from 'lucide-react';
import './Courses.css';

const DUMMY_COURSES = [
  { id: 'CRS-01', name: 'UI/UX Design Masterclass', duration: '12 Weeks', fee: '₹25,000', status: 'ACTIVE', batches: 3, students: 45 },
  { id: 'CRS-02', name: 'Advanced Graphic Design', duration: '8 Weeks', fee: '₹18,000', status: 'ACTIVE', batches: 2, students: 28 },
  { id: 'CRS-03', name: 'Motion Graphics basics', duration: '6 Weeks', fee: '₹15,000', status: 'PLANNED', batches: 0, students: 0 },
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="courses-container">
      <div className="page-header">
        <div>
          <h1>Courses & Training</h1>
          <p>Manage curriculum, batches, and student enrollments.</p>
        </div>
        <button className="btn-primary">
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

      <div className="courses-grid">
        {DUMMY_COURSES.map((course) => (
          <div className="course-card" key={course.id}>
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
                <span className="course-tag highlight">{course.fee}</span>
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
              <span className={`status-badge status-${course.status.toLowerCase()}`}>
                {course.status}
              </span>
              <button className="btn-text">Manage Batches</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
