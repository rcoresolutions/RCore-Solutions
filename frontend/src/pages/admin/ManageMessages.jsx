import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import api, { errMsg } from '../../api.js';

export default function ManageMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const load = () => api.get('/messages').then((r) => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const view = async (m) => {
    setOpen(open === m._id ? null : m._id);
    if (!m.read) { await api.put(`/messages/${m._id}/read`, { read: true }).catch(() => {}); load(); }
  };
  const markUnread = async (m) => { await api.put(`/messages/${m._id}/read`, { read: false }); load(); };
  const remove = async (m) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.delete(`/messages/${m._id}`); toast.success('Message deleted.'); load(); } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div>
      <div className="admin-head"><div><h1>Messages</h1><p className="muted">Enquiries sent from the contact form.</p></div></div>
      <div className="panel">
        {loading && <p className="empty">Loading...</p>}
        {!loading && items.length === 0 && <p className="empty">No messages yet.</p>}
        {items.map((m) => (
          <div className={`msg ${m.read ? '' : 'unread'}`} key={m._id}>
            <button className="msg-head" onClick={() => view(m)}>
              <strong>{m.name}</strong>
              <span>{m.subject || 'No subject'}</span>
              <small>{new Date(m.createdAt).toLocaleString()}</small>
            </button>
            {open === m._id && (
              <div className="msg-body">
                <p><a href={`mailto:${m.email}`}>{m.email}</a>{m.phone && <> &middot; <a href={`tel:${m.phone}`}>{m.phone}</a></>}</p>
                <p className="prose pre">{m.message}</p>
                <div className="row-gap">
                  <a className="btn btn-primary btn-sm" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your enquiry')}`}>Reply by email</a>
                  <button className="btn btn-ghost btn-sm" onClick={() => markUnread(m)}>{m.read ? <Mail size={15} /> : <MailOpen size={15} />} Mark as unread</button>
                  <button className="btn btn-ghost btn-sm danger-text" onClick={() => remove(m)}><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
