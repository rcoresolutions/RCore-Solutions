import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSettings } from '../context/SettingsContext.jsx';
import { PageHeader } from '../components/Cards.jsx';
import { waLink } from '../components/WhatsAppButton.jsx';

export default function Contact() {
  const { settings: s } = useSettings();
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: '', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/messages', form);
      toast.success(data.message);
      setForm({ ...form, phone: '', subject: '', message: '' });
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions, quotes or support. We reply within one working day." />
      <section className="section">
        <div className="container contact-grid">
          <form className="card form" onSubmit={submit}>
            <h2>Send a message</h2>
            <div className="field-row">
              <div className="field"><label htmlFor="c-name">Full name</label><input id="c-name" required value={form.name} onChange={set('name')} /></div>
              <div className="field"><label htmlFor="c-email">Email</label><input id="c-email" type="email" required value={form.email} onChange={set('email')} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label htmlFor="c-phone">Phone (optional)</label><input id="c-phone" value={form.phone} onChange={set('phone')} /></div>
              <div className="field"><label htmlFor="c-subject">Subject</label><input id="c-subject" value={form.subject} onChange={set('subject')} /></div>
            </div>
            <div className="field"><label htmlFor="c-msg">Message</label><textarea id="c-msg" rows="6" required value={form.message} onChange={set('message')} /></div>
            <button className="btn btn-primary btn-lg" disabled={busy}>{busy ? 'Sending...' : 'Send message'}</button>
          </form>

          <div className="contact-info">
            {s.whatsappNumber && (
              <a className="card info wa" target="_blank" rel="noreferrer" href={waLink(s.whatsappNumber, s.whatsappMessage)}>
                <MessageCircle size={22} /><div><strong>Chat on WhatsApp</strong><span>Fastest way to reach us</span></div>
              </a>
            )}
            {s.phone && <a className="card info" href={`tel:${s.phone.replace(/\s/g, '')}`}><Phone size={22} /><div><strong>Call us</strong><span>{s.phone}</span></div></a>}
            {s.email && <a className="card info" href={`mailto:${s.email}`}><Mail size={22} /><div><strong>Email</strong><span>{s.email}</span></div></a>}
            {s.address && <div className="card info"><MapPin size={22} /><div><strong>Visit us</strong><span>{s.address}</span></div></div>}
            {s.workingHours && <div className="card info"><Clock size={22} /><div><strong>Working hours</strong><span>{s.workingHours}</span></div></div>}
          </div>
        </div>
      </section>
    </>
  );
}
