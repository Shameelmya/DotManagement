import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../services/firebase';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // For the demo / build, if mock login is requested (no real firebase config provided),
      // we can simulate a successful login if the API key is "dummy-api-key"
      if (import.meta.env.VITE_FIREBASE_API_KEY === "dummy-api-key" || !import.meta.env.VITE_FIREBASE_API_KEY) {
         console.warn("Using dummy login since Firebase config is missing.");
         setUser({ uid: 'mock-user-123', email } as any);
         navigate('/dashboard');
         return;
      }
      
      const auth = getAuth(app);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/logo.png" alt="Dot Projects" className="login-logo" onError={(e) => {
           // Fallback if logo.png doesn't exist (e.g. wiped during project init)
           e.currentTarget.style.display = 'none';
        }}/>
        {!(document.querySelector('img[src="/logo.png"]') as HTMLImageElement)?.complete && (
           <h1 className="login-brand-text">Dot Projects</h1>
        )}
      </div>
      
      <p className="login-subtitle">Sign in to your management system</p>
      
      {error && <div className="login-error">{error}</div>}
      
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input 
            type="email" 
            id="email" 
            placeholder="name@dotprojects.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className="login-actions">
          <label className="remember-me">
            <input type="checkbox" /> Remember me
          </label>
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>
        
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
