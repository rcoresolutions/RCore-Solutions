import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import api from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import { PageHeader, Thumb } from '../components/Cards.jsx';
import Reviews from '../components/Reviews.jsx';
import { waLink } from '../components/WhatsAppButton.jsx';
import NotFound from './NotFound.jsx';

export default function ServiceDetail() {
  const { id } = useParams();
  const { settings: s } = useSettings();
  const [item, setItem] = useState(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setItem(null);
    api.get(`/services/${id}`).then((r) => setItem(r.data)).catch(() => setMissing(true));
  }, [id]);

  if (missing) return <NotFound />;
  if (!item) return <div className="page-loading">Loading...</div>;

  return (
    <>
      <PageHeader title={item.title} subtitle={item.shortDescription}><Link to="/services" className="back">&larr; All services</Link></PageHeader>
      <section className="section">
        <div className="container detail">
          <div>
            <Thumb src={item.image} alt={item.title} />
            <h2>Overview</h2>
            <p className="prose">{item.description || item.shortDescription}</p>
          </div>
          <aside className="card side">
            <h3>What is included</h3>
            <ul className="checks">{item.features?.map((f) => <li key={f}><Check size={18} />{f}</li>)}</ul>
            <Link to="/contact" className="btn btn-primary btn-block">Request a quote</Link>
            {s.whatsappNumber && (
              <a className="btn btn-ghost btn-block" target="_blank" rel="noreferrer" href={waLink(s.whatsappNumber, `Hello, I am interested in your "${item.title}" service.`)}>
                <MessageCircle size={18} /> Ask on WhatsApp
              </a>
            )}
          </aside>
        </div>
        <div className="container"><Reviews targetType="service" targetId={item._id} title="Reviews for this service" /></div>
      </section>
    </>
  );
}
