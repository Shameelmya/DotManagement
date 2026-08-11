import React, { useState, useEffect, useRef } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import './ActionMenu.css';

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="action-menu-container" ref={menuRef} onClick={(e) => e.stopPropagation()}>
      <button 
        className="action-menu-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="More options"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="action-menu-dropdown glass-panel">
          <button className="action-menu-item" onClick={() => { setIsOpen(false); onEdit(); }}>
            <Edit2 size={14} />
            <span>Edit</span>
          </button>
          <button className="action-menu-item text-error" onClick={() => { setIsOpen(false); onDelete(); }}>
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};
