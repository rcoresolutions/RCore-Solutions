import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { assetUrl } from '../api.js';
import { useSettings } from '../context/SettingsContext.jsx';

export default function Footer() {
  const { settings: s } = useSettings();
  const socials = [
    ['facebook', Facebook], ['instagram', Instagram], ['linkedin', Linkedin], ['twitter', Twitter],
  ].filter(([k]) => s[k]);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="brand light">
            <img src={assetUrl(s.logoUrl)} alt="" />
            <span>{s.siteName}</span>
          </div>
          <p>{s.footerText}</p>
          {socials.length > 0 && (
            <div className="socials">
              {socials.map(([k, Icon]) => (
                <a key={k} href={s[k]} target="_blank" rel="noreferrer" aria-label={k}><Icon size={18} /></a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/services">Services</Link>
          <Link to="/products">Products</Link>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Account</h4>
          <Link to="/login">Log in</Link>
          <Link to="/register">Create account</Link>
        </div>
        <div>
          <h4>Contact</h4>
          {s.email && <a href={`mailto:${s.email}`}><Mail size={16} /> {s.email}</a>}
          {s.phone && <a href={`tel:${s.phone.replace(/\s/g, '')}`}><Phone size={16} /> {s.phone}</a>}
          {s.address && <span><MapPin size={16} /> {s.address}</span>}
          {s.workingHours && <span><Clock size={16} /> {s.workingHours}</span>}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">&copy; {new Date().getFullYear()} {s.siteName}. All rights reserved.</div>
      </div>
    </footer>
  );
}
