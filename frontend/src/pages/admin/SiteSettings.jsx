import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg, assetUrl } from '../../api.js';
import { useSettings } from '../../context/SettingsContext.jsx';

const groups = [
  ['Brand', [
    ['siteName', 'Website name'], ['tagline', 'Tagline'], ['primaryColor', 'Theme color', 'color'], ['logoUrl', 'Logo', 'logo'],
  ]],
  ['Home page', [
    ['heroTitle', 'Hero headline', 'textarea'], ['heroSubtitle', 'Hero text', 'textarea'],
  ]],
  ['About page', [
    ['aboutTitle', 'Heading'], ['aboutText', 'Text (blank line between paragraphs)', 'textarea', 6],
  ]],
  ['Contact and WhatsApp', [
    ['whatsappNumber', 'WhatsApp number', 'text', 'Digits with country code, e.g. 923001234567. Leave empty to hide the WhatsApp button.'],
    ['whatsappMessage', 'WhatsApp starting message', 'textarea'],
    ['email', 'Email'], ['phone', 'Phone'], ['address', 'Address'], ['workingHours', 'Working hours'],
  ]],
  ['Store', [['currency', 'Currency label', 'text', 'Shown next to product prices, e.g. PKR, USD.']]],
  ['Social links', [['facebook', 'Facebook URL'], ['instagram', 'Instagram URL'], ['linkedin', 'LinkedIn URL'], ['twitter', 'X / Twitter URL']]],
  ['Footer', [['footerText', 'Footer text']]],
];

export default function SiteSettings() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  useEffect(() => setForm(settings), [settings]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', fd);
      set('logoUrl', data.url);
      toast.success('Logo uploaded. Remember to save.');
    } catch (err) { toast.error(errMsg(err)); } finally { setUploading(false); }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      await refresh();
      toast.success('Settings saved.');
    } catch (err) { toast.error(errMsg(err)); } finally { setSaving(false); }
  };

  return (
    <form onSubmit={save}>
      <div className="admin-head">
        <div><h1>Website settings</h1><p className="muted">Changes appear on the website immediately after saving.</p></div>
        <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save settings'}</button>
      </div>
      {groups.map(([title, fields]) => (
        <div className="panel" key={title}>
          <h2>{title}</h2>
          <div className="form-grid">
            {fields.map(([key, label, type = 'text', extra]) => (
              <div className={`field ${type === 'textarea' || type === 'logo' ? 'wide' : ''}`} key={key}>
                <label htmlFor={`s-${key}`}>{label}</label>
                {type === 'textarea' ? (
                  <textarea id={`s-${key}`} rows={typeof extra === 'number' ? extra : 3} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
                ) : type === 'color' ? (
                  <div className="color-field">
                    <input type="color" id={`s-${key}`} value={/^#[0-9a-f]{6}$/i.test(form[key]) ? form[key] : '#FC6E02'} onChange={(e) => set(key, e.target.value)} />
                    <input value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
                  </div>
                ) : type === 'logo' ? (
                  <div className="image-field">
                    <img src={assetUrl(form.logoUrl)} alt="Logo preview" className="logo-preview" />
                    <div className="image-controls">
                      <input value={form.logoUrl || ''} onChange={(e) => set('logoUrl', e.target.value)} />
                      <label className="btn btn-ghost btn-sm">{uploading ? 'Uploading...' : 'Upload new logo'}<input type="file" accept="image/*" hidden onChange={uploadLogo} /></label>
                    </div>
                  </div>
                ) : (
                  <input id={`s-${key}`} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} />
                )}
                {typeof extra === 'string' && <small>{extra}</small>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </form>
  );
}
