import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, CreditCard, DollarSign, Wallet } from 'lucide-react';
import { dbService, Collections } from '../services/db';
import './Finance.css';

const Finance = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = dbService.subscribe(Collections.FINANCE, (data) => {
      // Sort by date manually if not indexed on server
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

  const filteredTxns = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Dynamic Calculations (Phase 18 Audit check)
  const totalIncome = transactions.filter(t => t.type === 'in').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = transactions.filter(t => t.type === 'out').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const netPosition = totalIncome - totalExpense;

  // Receivables would technically be calculated by summarizing Outstanding from Projects,
  // but for the isolated Finance view, we'll keep it as a placeholder until we run aggregate queries
  const receivables = 45000; // TODO: Pull from projects

  return (
    <div className="finance-container">
      <div className="page-header">
        <div>
          <h1>Finance</h1>
          <p>Track income, expenses, and overall financial health.</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-secondary" onClick={() => {
            const desc = prompt("Enter expense description:");
            const amt = prompt("Enter amount:");
            if (desc && amt && !isNaN(Number(amt))) {
                dbService.create(Collections.FINANCE, {
                    description: desc,
                    category: 'Expense',
                    amount: Number(amt),
                    type: 'out',
                    method: 'Bank Transfer'
                });
            }
          }}>
            <TrendingDown size={18} className="text-error" />
            <span>Add Expense</span>
          </button>
          <button className="btn-primary" onClick={() => {
            const desc = prompt("Enter income description:");
            const amt = prompt("Enter amount:");
            if (desc && amt && !isNaN(Number(amt))) {
                dbService.create(Collections.FINANCE, {
                    description: desc,
                    category: 'Income',
                    amount: Number(amt),
                    type: 'in',
                    method: 'Bank Transfer'
                });
            }
          }}>
            <TrendingUp size={18} />
            <span>Add Income</span>
          </button>
        </div>
      </div>

      {/* Finance Overview Cards (Glassmorphism styling) */}
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
            <DollarSign size={24} />
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
                  </div>
                );
            })
        )}
      </div>
    </div>
  );
};

export default Finance;
