import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { assetUrl, money } from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';
import Mark from './Mark.jsx';

export function Thumb({ src, alt }) {
  return (
    <div className="thumb">
      {src ? <img src={assetUrl(src)} alt={alt} loading="lazy" /> : <Mark className="thumb-mark" />}
    </div>
  );
}

export function ServiceCard({ item }) {
  return (
    <Link to={`/services/${item._id}`} className="card item-card">
      <Thumb src={item.image} alt={item.title} />
      <div className="item-body">
        <span className="tag">{item.category}</span>
        <h3>{item.title}</h3>
        <p>{item.shortDescription}</p>
        <span className="more">Learn more <ArrowRight size={16} /></span>
      </div>
    </Link>
  );
}

export function ProductCard({ item }) {
  const { settings } = useSettings();
  return (
    <Link to={`/products/${item._id}`} className="card item-card">
      <Thumb src={item.image} alt={item.name} />
      <div className="item-body">
        <span className="tag">{item.category}</span>
        <h3>{item.name}</h3>
        <p>{item.shortDescription}</p>
        <div className="price-row">
          <strong>{item.price > 0 ? money(item.price, settings.currency) : 'Contact for price'}</strong>
          {!item.inStock && <span className="badge-out">Unavailable</span>}
        </div>
      </div>
    </Link>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-header">
      <div className="container">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children}
      </div>
    </header>
  );
}
