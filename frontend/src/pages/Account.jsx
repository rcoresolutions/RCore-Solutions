import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PageHeader } from '../components/Cards.jsx';

export default function Account() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.put('/auth/profile', { name, currentPassword, newPassword });
      setUser(data.user);
      setCurrent('');
      setNew('');
      toast.success('Profile updated.');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="My account" subtitle={user.email} />
      <section className="section">
        <div className="container narrow">
          <form className="card form" onSubmit={submit}>
            <h2>Profile</h2>
            <div className="field"><label htmlFor="a-name">Full name</label><input id="a-name" required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <h3>Change password</h3>
            <div className="field"><label htmlFor="a-cur">Current password</label><input id="a-cur" type="password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrent(e.target.value)} /></div>
            <div className="field"><label htmlFor="a-new">New password</label><input id="a-new" type="password" minLength="6" autoComplete="new-password" value={newPassword} onChange={(e) => setNew(e.target.value)} /></div>
            <button className="btn btn-primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
          </form>
        </div>
      </section>
    </>
  );
}
