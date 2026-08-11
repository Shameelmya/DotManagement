import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/Login';
import { useAuthStore } from './store/useAuthStore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './services/firebase';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Staff from './pages/Staff';
import Finance from './pages/Finance';
import Courses from './pages/Courses';
import More from './pages/More';
import Settings from './pages/Settings';
import AuditLogs from './pages/AuditLogs';
import BackupRestore from './pages/BackupRestore';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const { setUser, setLoading, loading } = useAuthStore();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);

  if (loading) {
    return <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <img src="/logo.png" alt="Loading" style={{ maxWidth: 100, animation: 'pulse 1.5s infinite' }} onError={(e) => e.currentTarget.style.display='none'}/>
    </div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/work/projects" element={<Projects />} />
          <Route path="/work/tasks" element={<Tasks />} />
          <Route path="/team" element={<Staff />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/more" element={<More />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="/backup" element={<BackupRestore />} />
          {/* Add more routes later */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
