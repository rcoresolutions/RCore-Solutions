import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import api from '../api.js';
import { PageHeader, ProductCard } from '../components/Cards.jsx';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');

  useEffect(() => {
    api.get('/products').then((r) => setItems(r.data)).finally(() => setLoading(false));
  }, []);

  const cats = useMemo(() => ['All', ...new Set(items.map((i) => i.category))], [items]);
  const shown = items.filter((i) =>
    (cat === 'All' || i.category === cat) &&
    `${i.name} ${i.shortDescription}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader title="Products" subtitle="Software and plans built to keep your business running smoothly." />
      <section className="section">
        <div className="container">
          <div className="toolbar">
            <div className="chips">
              {cats.map((c) => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{c}</button>)}
            </div>
            <label className="search"><Search size={16} /><input placeholder="Search products" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          </div>
          {loading ? <p className="empty">Loading products...</p> : (
            <div className="grid grid-4">{shown.map((i) => <ProductCard key={i._id} item={i} />)}</div>
          )}
          {!loading && shown.length === 0 && <p className="empty">No products match your search.</p>}
        </div>
      </section>
    </>
  );
}
