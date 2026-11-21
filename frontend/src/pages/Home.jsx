import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Headphones, Rocket } from 'lucide-react';
import api from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import Mark from '../components/Mark.jsx';
import { ServiceCard, ProductCard } from '../components/Cards.jsx';
import Reviews from '../components/Reviews.jsx';
import { waLink } from '../components/WhatsAppButton.jsx';

export default function Home() {
  const { settings: s } = useSettings();
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/services', { params: { featured: 1, limit: 6 } }).then(async (r) => {
      if (r.data.length) return setServices(r.data);
      setServices((await api.get('/services', { params: { limit: 6 } })).data);
    }).catch(() => {});
    api.get('/products', { params: { featured: 1, limit: 4 } }).then(async (r) => {
      if (r.data.length) return setProducts(r.data);
      setProducts((await api.get('/products', { params: { limit: 4 } })).data);
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="hero">
        <Mark className="hero-mark" />
        <div className="container hero-inner">
          <h1>{s.heroTitle}</h1>
          <p>{s.heroSubtitle}</p>
          <div className="row-gap">
            <Link to="/services" className="btn btn-light btn-lg">Explore services</Link>
            <Link to="/contact" className="btn btn-outline-light btn-lg">Contact us</Link>
            {s.whatsappNumber && (
              <a href={waLink(s.whatsappNumber, s.whatsappMessage)} target="_blank" rel="noreferrer" className="btn btn-outline-light btn-lg">WhatsApp</a>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>What we do</h2>
              <p>End-to-end technology services, delivered by one accountable team.</p>
            </div>
            <Link to="/services" className="more">All services <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-3">
            {services.map((i) => <ServiceCard key={i._id} item={i} />)}
          </div>
          {services.length === 0 && <p className="empty">Services are coming soon.</p>}
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>Ready-to-use products</h2>
              <p>Software and plans you can start using right away.</p>
            </div>
            <Link to="/products" className="more">All products <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-4">
            {products.map((i) => <ProductCard key={i._id} item={i} />)}
          </div>
          {products.length === 0 && <p className="empty">Products are coming soon.</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><div><h2>Why teams choose {s.siteName}</h2></div></div>
          <div className="grid grid-3">
            <div className="why"><Rocket size={26} /><h3>Delivered on schedule</h3><p>Clear milestones and regular updates, so you always know where your project stands.</p></div>
            <div className="why"><ShieldCheck size={26} /><h3>Secure and dependable</h3><p>Security, backups and testing are part of every build, not an extra.</p></div>
            <div className="why"><Headphones size={26} /><h3>Support that answers</h3><p>Talk to the people who built your system. Reach us by phone, email or WhatsApp.</p></div>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container"><Reviews targetType="site" title="What customers say" limit={6} /></div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2>Have a project in mind?</h2>
          <p>Tell us what you need. We will reply within one working day.</p>
          <Link to="/contact" className="btn btn-light btn-lg">Contact us</Link>
        </div>
      </section>
    </>
  );
}
