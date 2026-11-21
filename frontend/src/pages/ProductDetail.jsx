import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import api, { money } from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { PageHeader, Thumb } from '../components/Cards.jsx';
import Reviews from '../components/Reviews.jsx';
import { waLink } from '../components/WhatsAppButton.jsx';
import NotFound from './NotFound.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const { settings: s } = useSettings();
  const [item, setItem] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setItem(null);
    api.get(`/products/${id}`).then((r) => setItem(r.data)).catch(() => setMissing(true));
  }, [id]);

  if (missing) return <NotFound />;
  if (!item) return <div className="page-loading">Loading...</div>;

  return (
    <>
      <PageHeader title={item.name} subtitle={item.shortDescription}><Link to="/products" className="back">&larr; All products</Link></PageHeader>
      <section className="section">
        <div className="container detail">
          <div>
            <Thumb src={item.image} alt={item.name} />
            <h2>About this product</h2>
            <p className="prose">{item.description || item.shortDescription}</p>
          </div>
          <aside className="card side">
            <div className="big-price">{item.price > 0 ? money(item.price, s.currency) : 'Contact for price'}</div>
            <span className={item.inStock ? 'badge-in' : 'badge-out'}>{item.inStock ? 'Available' : 'Currently unavailable'}</span>
            {item.features?.length > 0 && (
              <>
                <h3>Key features</h3>
                <ul className="checks">{item.features.map((f) => <li key={f}><Check size={18} />{f}</li>)}</ul>
              </>
            )}
            <Link to="/contact" className="btn btn-primary btn-block">Request a demo</Link>
            {s.whatsappNumber && (
              <a className="btn btn-ghost btn-block" target="_blank" rel="noreferrer" href={waLink(s.whatsappNumber, `Hello, I would like to know more about "${item.name}".`)}>
                <MessageCircle size={18} /> Order on WhatsApp
              </a>
            )}
          </aside>
        </div>
        <div className="container"><Reviews targetType="product" targetId={item._id} title="Reviews for this product" /></div>
      </section>
    </>
  );
}
