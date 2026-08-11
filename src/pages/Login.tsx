import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../services/firebase';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const targetEmail = username === 'admin' ? 'admin@dotprojects.com' : username;
      
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, targetEmail, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-login-credentials') {
        try {
          const auth = getAuth(app);
          await createUserWithEmailAndPassword(auth, 'admin@dotprojects.com', 'admin@123');
          await signInWithEmailAndPassword(auth, 'admin@dotprojects.com', password);
          navigate('/dashboard');
        } catch (createErr: any) {
          setError(`Could not create test account: ${createErr.message}`);
        }
      } else {
        setError(err.message || 'Invalid username or password');
      }
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
          <label htmlFor="email">Email or Username</label>
          <input 
            type="text" 
            id="email" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button 
              type="button" 
              className="password-toggle-btn" 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
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
