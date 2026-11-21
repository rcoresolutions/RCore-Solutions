import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Stars, StarInput } from './Stars.jsx';

export default function Reviews({ targetType = 'site', targetId = null, title = 'Customer reviews', limit }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    const params = { targetType, limit };
    if (targetId) params.targetId = targetId;
    api.get('/reviews', { params }).then((r) => setReviews(r.data)).catch(() => {});
  };
  useEffect(load, [targetType, targetId]); // eslint-disable-line

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error('Please choose a star rating.');
    setBusy(true);
    try {
      await api.post('/reviews', { targetType, targetId, rating, comment });
      toast.success('Thanks! Your review is now live.');
      setRating(0);
      setComment('');
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      toast.success('Review deleted.');
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <section className="reviews">
      <div className="reviews-head">
        <h2>{title}</h2>
        {reviews.length > 0 && (
          <div className="reviews-avg">
            <strong>{avg.toFixed(1)}</strong>
            <Stars value={avg} />
            <span>{reviews.length} review{reviews.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="reviews-layout">
        <div className="review-list">
          {reviews.length === 0 && <p className="empty">No reviews yet. Be the first to share your experience.</p>}
          {reviews.map((r) => (
            <article className="review" key={r._id}>
              <div className="review-top">
                <span className="avatar">{(r.user?.name || '?')[0].toUpperCase()}</span>
                <div>
                  <strong>{r.user?.name || 'Customer'}</strong>
                  <small>{new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</small>
                </div>
                <Stars value={r.rating} size={15} />
              </div>
              <p>{r.comment}</p>
              {user && (user.role === 'admin' || user._id === r.user?._id) && (
                <button className="link-danger" onClick={() => remove(r._id)}><Trash2 size={14} /> Delete</button>
              )}
            </article>
          ))}
        </div>

        <div className="review-form card">
          {user ? (
            <form onSubmit={submit}>
              <h3>Write a review</h3>
              <StarInput value={rating} onChange={setRating} />
              <label htmlFor="rv-comment" className="sr-only">Your review</label>
              <textarea id="rv-comment" rows="4" maxLength="1000" required placeholder="Tell us about your experience" value={comment} onChange={(e) => setComment(e.target.value)} />
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Posting...' : 'Post review'}</button>
            </form>
          ) : (
            <div>
              <h3>Share your experience</h3>
              <p className="muted">Log in or create a free account to write a review.</p>
              <div className="row-gap">
                <Link to="/login" className="btn btn-primary">Log in</Link>
                <Link to="/register" className="btn btn-ghost">Create account</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
