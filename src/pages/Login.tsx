import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { app, db } from '../services/firebase';
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
      const auth = getAuth(app);
      
      // Strict authentication using their actual email and password
      const userCredential = await signInWithEmailAndPassword(auth, username, password);
      const firebaseUser = userCredential.user;
      
      // Query the staff collection to get their profile
      const staffRef = collection(db, 'staff');
      const q = query(staffRef, where('email', '==', username));
      const querySnapshot = await getDocs(q);
      
      let profile = null;
      if (!querySnapshot.empty) {
        profile = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      } else {
        // Fallback for root admin if no profile exists
        if (username === 'admin@dotprojects.com' || username === 'admin') {
          profile = { id: firebaseUser.uid, role: 'SUPER_ADMIN', name: 'Administrator', email: username, status: 'ACTIVE' };
        } else {
          throw new Error('User profile not found in database.');
        }
      }
      
      // Check if user is active
      if (profile.status !== 'ACTIVE') {
        const { signOut } = await import('firebase/auth');
        await signOut(auth);
        throw new Error('Your account is not active. Please contact administration.');
      }
      
      setUser(firebaseUser, profile as any);
      navigate('/dashboard');
      
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('not active')) {
         setError(err.message);
      } else {
         setError('Invalid username or password. Please try again.');
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
