import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { errMsg, assetUrl } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

function AuthShell({ title, subtitle, children, footer }) {
  const { settings } = useSettings();
  return (
    <section className="auth">
      <div className="auth-card card">
        <img className="auth-logo" src={assetUrl(settings.logoUrl)} alt="" />
        <h1>{title}</h1>
        <p className="muted">{subtitle}</p>
        {children}
        <p className="auth-foot">{footer}</p>
      </div>
    </section>
  );
}

export function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(form.email, form.password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      navigate(location.state?.from || (u.role === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Log in" subtitle="Welcome back. Enter your details to continue." footer={<>New here? <Link to="/register">Create an account</Link></>}>
      <form className="form" onSubmit={submit}>
        <div className="field"><label htmlFor="l-email">Email</label><input id="l-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="field"><label htmlFor="l-pass">Password</label><input id="l-pass" type="password" required autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
        <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Logging in...' : 'Log in'}</button>
      </form>
    </AuthShell>
  );
}

export function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Your account is ready.');
      navigate('/');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="Sign up to write reviews and stay in touch." footer={<>Already have an account? <Link to="/login">Log in</Link></>}>
      <form className="form" onSubmit={submit}>
        <div className="field"><label htmlFor="r-name">Full name</label><input id="r-name" required autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
        <div className="field"><label htmlFor="r-email">Email</label><input id="r-email" type="email" required autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
        <div className="field"><label htmlFor="r-pass">Password</label><input id="r-pass" type="password" required minLength="6" autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /><small>At least 6 characters.</small></div>
        <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</button>
      </form>
    </AuthShell>
  );
}
