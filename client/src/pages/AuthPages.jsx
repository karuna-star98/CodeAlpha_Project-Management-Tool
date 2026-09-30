import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

function AuthShell({ children, title, subtitle }) {
  return (
    <div className="auth-page">
      <div className="auth-visual">
        <div className="auth-visual-inner">
          <Link to="/login" className="brand light"><span className="brand-mark">TF</span><span>TaskFlow</span></Link>
          <div className="hero-copy">
            <div className="eyebrow">TEAM WORK, MADE VISIBLE</div>
            <h1>Turn scattered work into a shared workflow.</h1>
            <p>Create projects, assign ownership, track progress and keep conversations beside the work that matters.</p>
            <div className="mini-board">
              <div className="mini-column"><span>TO DO</span><i /><i /></div>
              <div className="mini-column"><span>IN PROGRESS</span><i /><i /><i /></div>
              <div className="mini-column"><span>DONE</span><i /></div>
            </div>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-box">
          <div className="mobile-brand"><Link to="/login" className="brand"><span className="brand-mark">TF</span><span>TaskFlow</span></Link></div>
          <div className="auth-heading"><h2>{title}</h2><p>{subtitle}</p></div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await login(form); navigate(location.state?.from || '/dashboard', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return <AuthShell title="Welcome back" subtitle="Sign in to continue to your workspace.">
    <ErrorMessage message={error} />
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" /></label>
      <button className="button primary full-button" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="auth-footer">New to TaskFlow? <Link to="/register">Create an account</Link></p>
    <div className="demo-box"><strong>Demo account</strong><span>owner@example.com</span><small>Password123!</small></div>
  </AuthShell>;
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try { await register(form); navigate('/dashboard', { replace: true }); }
    catch (err) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  return <AuthShell title="Create your account" subtitle="Start a new workspace in a few seconds.">
    <ErrorMessage message={error} />
    <form className="form-stack auth-form" onSubmit={submit}>
      <label>Full name<input required minLength="2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Asha Sharma" /></label>
      <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label>
      <label>Password<input type="password" required minLength="6" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></label>
      <button className="button primary full-button" disabled={submitting}>{submitting ? 'Creating…' : 'Create account'}</button>
    </form>
    <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
  </AuthShell>;
}
