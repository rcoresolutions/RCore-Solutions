import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, Package, Users, Star, Inbox } from 'lucide-react';
import api from '../../api.js';
import { Stars } from '../../components/Stars.jsx';

export default function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { api.get('/stats').then((r) => setD(r.data)).catch(() => {}); }, []);
  if (!d) return <p className="empty">Loading...</p>;

  const cards = [
    ['Services', d.services, Layers, '/admin/services'],
    ['Products', d.products, Package, '/admin/products'],
    ['Users', d.users, Users, '/admin/users'],
    ['Reviews', d.reviews, Star, '/admin/reviews'],
    ['Unread messages', d.unread, Inbox, '/admin/messages'],
  ];

  return (
    <div>
      <div className="admin-head"><div><h1>Dashboard</h1><p className="muted">A quick look at your website.</p></div></div>
      <div className="stat-grid">
        {cards.map(([label, n, Icon, to]) => (
          <Link to={to} className="stat" key={label}><Icon size={22} /><strong>{n}</strong><span>{label}</span></Link>
        ))}
      </div>
      <div className="two-col">
        <div className="panel">
          <h2>Latest messages</h2>
          {d.recentMessages.length === 0 && <p className="empty">No messages yet.</p>}
          {d.recentMessages.map((m) => (
            <div className="feed" key={m._id}>
              <strong>{m.name} {!m.read && <span className="pill brand">New</span>}</strong>
              <span>{m.subject || m.message.slice(0, 70)}</span>
              <small>{new Date(m.createdAt).toLocaleString()}</small>
            </div>
          ))}
        </div>
        <div className="panel">
          <h2>Latest reviews</h2>
          {d.recentReviews.length === 0 && <p className="empty">No reviews yet.</p>}
          {d.recentReviews.map((r) => (
            <div className="feed" key={r._id}>
              <strong>{r.user?.name || 'Deleted user'} <Stars value={r.rating} size={13} /></strong>
              <span>{r.comment.slice(0, 80)}</span>
              <small>{r.targetName}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
