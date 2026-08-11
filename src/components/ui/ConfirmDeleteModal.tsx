import React from 'react';
import { Modal } from './Modal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <p style={{ color: 'var(--color-text-main)', marginBottom: 'var(--spacing-4)' }}>
        Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
      </p>
      <div className="modal-actions">
        <button className="btn-secondary" onClick={onClose}>Cancel</button>
        <button 
          className="btn-primary" 
          style={{ backgroundColor: 'var(--color-error)' }} 
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};
