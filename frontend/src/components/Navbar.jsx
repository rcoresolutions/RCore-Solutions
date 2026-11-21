import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, LayoutDashboard, LogOut, UserRound, ArrowRight } from 'lucide-react';
import api, { assetUrl, groupBy, money } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';

export default function Navbar() {
  const { settings } = useSettings();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(null); // 'services' | 'products' | null
  const [mobile, setMobile] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/services').then((r) => setServices(r.data)).catch(() => {});
    api.get('/products').then((r) => setProducts(r.data)).catch(() => {});
  }, []);

  useEffect(() => { setOpen(null); setMobile(false); }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const toggle = (name) => setOpen((o) => (o === name ? null : name));
  const hoverOpen = (name) => window.matchMedia('(min-width: 981px)').matches && setOpen(name);

  const serviceGroups = Object.entries(groupBy(services)).slice(0, 4);
  const productGroups = Object.entries(groupBy(products)).slice(0, 3);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className="site-header" onMouseLeave={() => window.matchMedia('(min-width: 981px)').matches && setOpen(null)}>
      <div className="container nav-bar">
        <Link to="/" className="brand" aria-label={`${settings.siteName} home`}>
          <img src={assetUrl(settings.logoUrl)} alt="" />
          <span>{settings.siteName}</span>
        </Link>

        <button className="nav-toggle" onClick={() => setMobile((m) => !m)} aria-label="Toggle menu" aria-expanded={mobile}>
          {mobile ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`nav ${mobile ? 'open' : ''}`} aria-label="Main">
          <ul>
            <li onMouseEnter={() => hoverOpen(null)}><NavLink to="/" end>Home</NavLink></li>

            <li onMouseEnter={() => hoverOpen('services')}>
              <button className={`nav-btn ${open === 'services' ? 'active' : ''}`} onClick={() => toggle('services')} aria-expanded={open === 'services'}>
                Services <ChevronDown size={16} />
              </button>
              {open === 'services' && (
                <div className="mega" role="region" aria-label="Services menu">
                  <div className="container mega-grid">
                    {serviceGroups.map(([cat, list]) => (
                      <div className="mega-col" key={cat}>
                        <h4>{cat}</h4>
                        {list.slice(0, 5).map((s) => (
                          <Link key={s._id} to={`/services/${s._id}`}><b>{s.title}</b><small>{s.shortDescription}</small></Link>
                        ))}
                      </div>
                    ))}
                    {serviceGroups.length === 0 && <p className="mega-empty">Services will appear here once added.</p>}
                    <div className="mega-feature">
                      <h4>Need something custom?</h4>
                      <p>Tell us what you are building and we will suggest the right approach.</p>
                      <Link to="/contact" className="btn btn-light">Talk to our team</Link>
                      <Link to="/services" className="mega-all">View all services <ArrowRight size={16} /></Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li onMouseEnter={() => hoverOpen('products')}>
              <button className={`nav-btn ${open === 'products' ? 'active' : ''}`} onClick={() => toggle('products')} aria-expanded={open === 'products'}>
                Products <ChevronDown size={16} />
              </button>
              {open === 'products' && (
                <div className="mega" role="region" aria-label="Products menu">
                  <div className="container mega-grid">
                    {productGroups.map(([cat, list]) => (
                      <div className="mega-col" key={cat}>
                        <h4>{cat}</h4>
                        {list.slice(0, 5).map((p) => (
                          <Link key={p._id} to={`/products/${p._id}`}>
                            <b>{p.name}</b>
                            <small>{p.price > 0 ? `From ${money(p.price, settings.currency)}` : p.shortDescription}</small>
                          </Link>
                        ))}
                      </div>
                    ))}
                    {productGroups.length === 0 && <p className="mega-empty">Products will appear here once added.</p>}
                    <div className="mega-feature">
                      <h4>Not sure which fits?</h4>
                      <p>We will help you compare options and choose the right product for your team.</p>
                      <Link to="/contact" className="btn btn-light">Ask for advice</Link>
                      <Link to="/products" className="mega-all">View all products <ArrowRight size={16} /></Link>
                    </div>
                  </div>
                </div>
              )}
            </li>

            <li onMouseEnter={() => hoverOpen(null)}><NavLink to="/about">About</NavLink></li>
            <li onMouseEnter={() => hoverOpen(null)}><NavLink to="/contact">Contact</NavLink></li>
          </ul>

          <div className="nav-actions" onMouseEnter={() => hoverOpen(null)}>
            {user ? (
              <>
                {user.role === 'admin' && <Link to="/admin" className="btn btn-ghost btn-sm"><LayoutDashboard size={16} /> Admin panel</Link>}
                <Link to="/account" className="btn btn-ghost btn-sm"><UserRound size={16} /> {user.name.split(' ')[0]}</Link>
                <button className="btn btn-sm btn-plain" onClick={handleLogout}><LogOut size={16} /> Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Sign up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
