import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api.js';
import { PageHeader, ServiceCard } from '../components/Cards.jsx';

export default function Services() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    api.get('/services').then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const cats = useMemo(() => ['All', ...new Set(items.map((i) => i.category))], [items]);
  const shown = items.filter((i) =>
    (cat === 'All' || i.category === cat) &&
    `${i.title} ${i.shortDescription}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Services" subtitle="Everything you need to plan, build and run your technology." />
      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="chips">
              {cats.map((c) => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
            </div>
            <label className="search"><Search size={16} /><input placeholder="Search services" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          </div>
          {loading ? <p className="empty">Loading services...</p> : (
            <div className="grid grid-3">{shown.map((i) => <ServiceCard key={i._id} item={i} />)}</div>
          )}
          {!loading && shown.length === 0 && <p className="empty">No services match your search.</p>}
        </div>
      </section>
    </>
  );
}
