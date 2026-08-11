import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, CreditCard, IndianRupee, Wallet } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import { Modal } from '../components/ui/Modal';
import { ActionMenu } from '../components/ui/ActionMenu';
import { ConfirmDeleteModal } from '../components/ui/ConfirmDeleteModal';
import './Finance.css';

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingTxn, setDeletingTxn] = useState<{id: string, description: string} | null>(null);

  const [formData, setFormData] = useState({
    description: '',
    category: 'Income',
    amount: 0,
    type: 'in',
    method: 'Bank Transfer'
  });

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.FINANCE, (data) => {
      const sorted = data.sort((a, b) => {
          const dA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
          const dB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
          return dB - dA;
      });
      setTransactions(sorted);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenForm = (type: 'in' | 'out', txn?: any) => {
    if (txn) {
      setEditingId(txn.id);
      setFormData({
        description: txn.description || '',
        category: txn.category || (txn.type === 'in' ? 'Income' : 'Expense'),
        amount: txn.amount || 0,
        type: txn.type || 'in',
        method: txn.method || 'Bank Transfer'
      });
    } else {
      setEditingId(null);
      setFormData({ 
        description: '', 
        category: type === 'in' ? 'Income' : 'Expense', 
        amount: 0, 
        type, 
        method: 'Bank Transfer' 
      });
    }
    setIsFormOpen(true);
  };

  const handleSaveForm = async () => {
    if (!formData.description.trim() || formData.amount <= 0) return;
    try {
      if (editingId) {
        await dbService.update(Collections.FINANCE, editingId, formData);
      } else {
        await dbService.create(Collections.FINANCE, formData);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to save transaction", err);
    }
  };

  const handleDelete = async () => {
    if (deletingTxn) {
      try {
        await dbService.delete(Collections.FINANCE, deletingTxn.id);
      } catch (err) {
        console.error("Failed to delete transaction", err);
      }
    }
  };

  const filteredTxns = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalIncome = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const netPosition = totalIncome - totalExpense;
  const receivables = 45000; // Placeholder until aggregate

  return (
    <div className="finance-container">
      <div className="page-header">
        <div>
          <h1>Finance</h1>
          <p>Track income, expenses, and overall financial health.</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-secondary" onClick={() => handleOpenForm('out')}>
            <TrendingDown size={18} className="text-error" />
            <span>Add Expense</span>
          </button>
          <button className="btn-primary" onClick={() => handleOpenForm('in')}>
            <TrendingUp size={18} />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      <div className="finance-overview">
        <div className="finance-card income glass-panel">
          <div className="finance-icon-box">
            <TrendingUp size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Total Income</span>
            <span className="value">₹{totalIncome.toLocaleString()}</span>
          </div>
        </div>
        <div className="finance-card expense glass-panel">
          <div className="finance-icon-box">
            <TrendingDown size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Total Expenses</span>
            <span className="value">₹{totalExpense.toLocaleString()}</span>
          </div>
        </div>
        <div className="finance-card net glass-panel">
          <div className="finance-icon-box">
            <IndianRupee size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Net Position</span>
            <span className="value">₹{netPosition.toLocaleString()}</span>
          </div>
        </div>
        <div className="finance-card receivables glass-panel">
          <div className="finance-icon-box">
            <CreditCard size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Receivables</span>
            <span className="value">₹{receivables.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={18} />
          <span>This Month</span>
        </button>
      </div>

      <div className="transactions-list glass-panel">
        <h3 style={{ marginBottom: '16px', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '8px' }}>Recent Transactions</h3>
        
        {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading transactions...</div>
        ) : filteredTxns.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Wallet size={48} style={{ color: 'var(--color-border)', margin: '0 auto 16px' }} />
                <h4 style={{ color: 'var(--color-text-main)' }}>No transactions</h4>
                <p style={{ color: 'var(--color-text-muted)' }}>Your financial records will appear here.</p>
            </div>
        ) : (
            filteredTxns.map((txn) => {
                const dateStr = txn.createdAt?.toDate ? txn.createdAt.toDate().toLocaleDateString() : 'Just now';
                return (
                  <div className="transaction-item" key={txn.id}>
                    <div className={`txn-icon ${txn.type === 'in' ? 'in' : 'out'}`}>
                      {txn.type === 'in' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    </div>
                    
                    <div className="txn-details">
                      <span className="txn-desc">{txn.description}</span>
                      <span className="txn-meta">{dateStr} • {txn.method}</span>
                    </div>
                    
                    <div className={`txn-amount ${txn.type === 'in' ? 'text-success' : 'text-error'}`}>
                      {txn.type === 'in' ? '+' : '-'}₹{Number(txn.amount || 0).toLocaleString()}
                    </div>
                    
                    <div style={{ marginLeft: '16px' }}>
                      <ActionMenu 
                        onEdit={() => handleOpenForm(txn.type, txn)}
                        onDelete={() => {
                          setDeletingTxn({ id: txn.id, description: txn.description });
                          setIsDeleteOpen(true);
                        }}
                      />
                    </div>
                  </div>
                );
            })
        )}
      </div>

      {/* Forms & Modals */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingId ? "Edit Transaction" : (formData.type === 'in' ? "Add Income" : "Add Expense")}>
        <div className="modal-form-group">
          <label>Description</label>
          <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="e.g. Website Payment" />
        </div>
        <div className="modal-form-group">
          <label>Amount (₹)</label>
          <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: Number(e.target.value)})} />
        </div>
        <div className="modal-form-group">
          <label>Category</label>
          <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="e.g. Design Services" />
        </div>
        <div className="modal-form-group">
          <label>Payment Method</label>
          <select value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})}>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={() => setIsFormOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSaveForm}>Save Transaction</button>
        </div>
      </Modal>

      <ConfirmDeleteModal 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        itemName={deletingTxn?.description || 'this transaction'}
      />
    </div>
  );
};

export default Finance;
