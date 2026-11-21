import { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Layers, Package, Users, Star, Inbox, Settings, LogOut, Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useSettings } from '../../context/SettingsContext.jsx';
import { assetUrl } from '../../api.js';

const links = [
  ['/admin', 'Dashboard', LayoutDashboard, true],
  ['/admin/services', 'Services', Layers],
  ['/admin/products', 'Products', Package],
  ['/admin/users', 'Users', Users],
  ['/admin/reviews', 'Reviews', Star],
  ['/admin/messages', 'Messages', Inbox],
  ['/admin/settings', 'Website settings', Settings],
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="admin">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <Link to="/admin" className="brand light"><img src={assetUrl(settings.logoUrl)} alt="" /><span>{settings.siteName}</span></Link>
        <nav onClick={() => setOpen(false)}>
          {links.map(([to, label, Icon, end]) => (
            <NavLink key={to} to={to} end={end}><Icon size={18} /> {label}</NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <Link to="/" target="_blank"><Globe size={18} /> View website</Link>
          <button onClick={() => { logout(); navigate('/login'); }}><LogOut size={18} /> Log out</button>
        </div>
      </aside>
      <div className="admin-main">
        <div className="admin-top">
          <button className="icon-btn menu-btn" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">{open ? <X size={22} /> : <Menu size={22} />}</button>
          <span>Signed in as <strong>{user.name}</strong></span>
        </div>
        <div className="admin-content"><Outlet /></div>
      </div>
    </div>
  );
}
