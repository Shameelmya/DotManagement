import React from 'react';
import { DatabaseBackup } from 'lucide-react';

const BackupRestore = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <DatabaseBackup size={32} style={{ color: 'var(--color-success)' }} />
        <h1>Backup & Restore</h1>
      </div>
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '16px' }}>
        <h2>Coming Soon</h2>
        <p className="text-muted" style={{ marginTop: '16px' }}>Automated daily backups and manual restore functions will be available here.</p>
      </div>
    </div>
  );
};

export default BackupRestore;
