import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import api, { errMsg } from '../../api.js';
import { Stars } from '../../components/Stars.jsx';

export default function ManageReviews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => api.get('/reviews', { params: { all: 1 } }).then((r) => setItems(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const toggle = async (r) => {
    try { await api.put(`/reviews/${r._id}/toggle`); toast.success(r.approved ? 'Review hidden.' : 'Review is now visible.'); load(); } catch (e) { toast.error(errMsg(e)); }
  };
  const remove = async (r) => {
    if (!window.confirm('Delete this review?')) return;
    try { await api.delete(`/reviews/${r._id}`); toast.success('Review deleted.'); load(); } catch (e) { toast.error(errMsg(e)); }
  };

  return (
    <div>
      <div className="admin-head"><div><h1>Reviews</h1><p className="muted">{items.length} total. Hide a review to remove it from the website without deleting it.</p></div></div>
      <div className="panel table-wrap">
        <table className="table">
          <thead><tr><th>User</th><th>For</th><th>Rating</th><th>Review</th><th>Status</th><th className="right">Actions</th></tr></thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id}>
                <td>{r.user?.name || 'Deleted user'}</td>
                <td>{r.targetName} <small className="muted">({r.targetType})</small></td>
                <td><Stars value={r.rating} size={14} /></td>
                <td className="cell-text">{r.comment}</td>
                <td><span className={`pill ${r.approved ? 'ok' : 'off'}`}>{r.approved ? 'Visible' : 'Hidden'}</span></td>
                <td className="right actions">
                  <button className="icon-btn" onClick={() => toggle(r)} aria-label={r.approved ? 'Hide' : 'Show'}>{r.approved ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  <button className="icon-btn danger" onClick={() => remove(r)} aria-label="Delete"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="empty">Loading...</p>}
        {!loading && items.length === 0 && <p className="empty">No reviews have been posted yet.</p>}
      </div>
    </div>
  );
}
