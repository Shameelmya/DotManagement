import React from 'react';
import { ShieldAlert } from 'lucide-react';

const AuditLogs = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <ShieldAlert size={32} style={{ color: 'var(--color-warning)' }} />
        <h1>Audit Logs</h1>
      </div>
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '16px' }}>
        <h2>Coming Soon</h2>
        <p className="text-muted" style={{ marginTop: '16px' }}>Detailed system activity and security logs will be available here.</p>
      </div>
    </div>
  );
};

export default AuditLogs;
