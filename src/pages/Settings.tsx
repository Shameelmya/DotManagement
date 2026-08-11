import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <SettingsIcon size={32} style={{ color: 'var(--color-primary)' }} />
        <h1>System Settings</h1>
      </div>
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '16px' }}>
        <h2>Coming Soon</h2>
        <p className="text-muted" style={{ marginTop: '16px' }}>System configuration and preferences will be available here in the next update.</p>
      </div>
    </div>
  );
};

export default Settings;
