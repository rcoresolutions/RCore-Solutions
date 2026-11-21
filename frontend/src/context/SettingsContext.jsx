import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api.js';

const defaults = {
  siteName: 'RCore Solutions', tagline: '', logoUrl: '/logo.jpeg', primaryColor: '#FC6E02',
  heroTitle: 'Technology that runs the core of your business.', heroSubtitle: '',
  aboutTitle: '', aboutText: '', whatsappNumber: '', whatsappMessage: '', email: '', phone: '',
  address: '', workingHours: '', currency: 'PKR', facebook: '', instagram: '', linkedin: '', twitter: '', footerText: '',
};

const SettingsContext = createContext({ settings: defaults, refresh: () => {} });
export const useSettings = () => useContext(SettingsContext);

// Darken a hex color by a percentage (used for hover states)
const shade = (hex, pct) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const f = (c) => Math.max(0, Math.min(255, Math.round(c * (1 - pct))));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, '0')).join('')}`;
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaults);

  const refresh = useCallback(() => api.get('/settings').then((r) => setSettings({ ...defaults, ...r.data })).catch(() => {}), []);
  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const c = /^#[0-9a-f]{6}$/i.test(settings.primaryColor) ? settings.primaryColor : '#FC6E02';
    document.documentElement.style.setProperty('--brand', c);
    document.documentElement.style.setProperty('--brand-dark', shade(c, 0.18));
    document.documentElement.style.setProperty('--brand-deep', shade(c, 0.42));
    document.title = settings.tagline ? `${settings.siteName} | ${settings.tagline}` : settings.siteName;
  }, [settings]);

  return <SettingsContext.Provider value={{ settings, refresh }}>{children}</SettingsContext.Provider>;
}
