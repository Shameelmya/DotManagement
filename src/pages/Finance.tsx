import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, CreditCard, DollarSign } from 'lucide-react';
import './Finance.css';

const DUMMY_TRANSACTIONS = [
  { id: 'TXN-1001', date: '11 Aug 2026', description: 'Web Design Pro - Advance', category: 'Income', amount: '₹40,000', type: 'in', method: 'Bank Transfer' },
  { id: 'TXN-1002', date: '10 Aug 2026', description: 'Office Internet', category: 'Expense', amount: '₹2,500', type: 'out', method: 'Credit Card' },
  { id: 'TXN-1003', date: '09 Aug 2026', description: 'Techcon Branding - Final', category: 'Income', amount: '₹1,00,000', type: 'in', method: 'UPI' },
  { id: 'TXN-1004', date: '08 Aug 2026', description: 'Freelance Developer', category: 'Expense', amount: '₹15,000', type: 'out', method: 'Bank Transfer' },
];

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="finance-container">
      <div className="page-header">
        <div>
          <h1>Finance</h1>
          <p>Track income, expenses, and overall financial health.</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-secondary">
            <TrendingDown size={18} className="text-error" />
            <span>Add Expense</span>
          </button>
          <button className="btn-primary">
            <TrendingUp size={18} />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Finance Overview Cards (Mobile: Stacked, Desktop: Grid) */}
      <div className="finance-overview">
        <div className="finance-card income">
          <div className="finance-icon-box">
            <TrendingUp size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Total Income</span>
            <span className="value">₹1,40,000</span>
          </div>
        </div>
        <div className="finance-card expense">
          <div className="finance-icon-box">
            <TrendingDown size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Total Expenses</span>
            <span className="value">₹17,500</span>
          </div>
        </div>
        <div className="finance-card net">
          <div className="finance-icon-box">
            <DollarSign size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Net Position</span>
            <span className="value">₹1,22,500</span>
          </div>
        </div>
        <div className="finance-card receivables">
          <div className="finance-icon-box">
            <CreditCard size={24} />
          </div>
          <div className="finance-data">
            <span className="label">Receivables</span>
            <span className="value">₹45,000</span>
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

      <div className="transactions-list">
        <h3>Recent Transactions</h3>
        
        {DUMMY_TRANSACTIONS.map((txn) => (
          <div className="transaction-item" key={txn.id}>
            <div className={`txn-icon ${txn.type === 'in' ? 'in' : 'out'}`}>
              {txn.type === 'in' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
            
            <div className="txn-details">
              <span className="txn-desc">{txn.description}</span>
              <span className="txn-meta">{txn.date} • {txn.method}</span>
            </div>
            
            <div className={`txn-amount ${txn.type === 'in' ? 'text-success' : 'text-error'}`}>
              {txn.type === 'in' ? '+' : '-'}{txn.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Finance;
