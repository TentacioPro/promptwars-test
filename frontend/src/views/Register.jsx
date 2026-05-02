import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';
import { Mail, Lock, User, LogIn } from 'lucide-react';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  function handleChange(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.displayName);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
      toast.success('Welcome!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Google sign-up failed');
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-card__header">
          <span className="auth-card__logo">⚡</span>
          <h1>Create Account</h1>
          <p>Join Skill Hub today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name"><User size={14} /> Full Name</label>
            <input id="reg-name" name="displayName" value={form.displayName} onChange={handleChange} required className="input" placeholder="Jane Doe" maxLength={100} />
          </div>
          <div className="form-group">
            <label htmlFor="reg-email"><Mail size={14} /> Email</label>
            <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label htmlFor="reg-password"><Lock size={14} /> Password</label>
            <input id="reg-password" name="password" type="password" value={form.password} onChange={handleChange} required className="input" placeholder="••••••••" minLength={6} />
          </div>
          <div className="form-group">
            <label htmlFor="reg-confirm"><Lock size={14} /> Confirm Password</label>
            <input id="reg-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required className="input" placeholder="••••••••" minLength={6} />
          </div>
          <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button onClick={handleGoogle} className="btn btn--ghost btn--full">
          <LogIn size={18} /> Sign up with Google
        </button>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
