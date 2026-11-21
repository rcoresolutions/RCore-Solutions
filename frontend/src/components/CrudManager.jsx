import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Search, X, Upload } from 'lucide-react';
import api, { errMsg, assetUrl } from '../api.js';

function ImageField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    setBusy(true);
    try {
      const { data } = await api.post('/upload', fd);
      onChange(data.url);
      toast.success('Image uploaded.');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };
  return (
    <div className="image-field">
      {value && <img src={assetUrl(value)} alt="Preview" />}
      <div className="image-controls">
        <input placeholder="Image URL or upload a file" value={value || ''} onChange={(e) => onChange(e.target.value)} />
        <label className="btn btn-ghost btn-sm">
          <Upload size={15} /> {busy ? 'Uploading...' : 'Upload'}
          <input type="file" accept="image/*" hidden onChange={upload} disabled={busy} />
        </label>
      </div>
    </div>
  );
}

function Field({ f, value, onChange }) {
  const id = `f-${f.name}`;
  if (f.type === 'checkbox') {
    return <label className="check-field"><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {f.label}</label>;
  }
  return (
    <div className={`field ${f.wide ? 'wide' : ''}`}>
      <label htmlFor={id}>{f.label}</label>
      {f.type === 'textarea' || f.type === 'lines' ? (
        <textarea id={id} rows={f.rows || 4} value={value ?? ''} placeholder={f.placeholder} onChange={(e) => onChange(e.target.value)} required={f.required} />
      ) : f.type === 'select' ? (
        <select id={id} value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
          {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : f.type === 'image' ? (
        <ImageField value={value} onChange={onChange} />
      ) : (
        <input id={id} type={f.type || 'text'} value={value ?? ''} placeholder={f.placeholder} required={f.required} minLength={f.minLength} min={f.type === 'number' ? 0 : undefined} onChange={(e) => onChange(e.target.value)} autoComplete="off" />
      )}
      {f.help && <small>{f.help}</small>}
    </div>
  );
}

export default function CrudManager({ title, noun, endpoint, columns, fields, blank, searchKeys }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null); // null | {id|null, values}
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get(endpoint, { params: { all: 1 } }).then((r) => setItems(r.data)).catch((e) => toast.error(errMsg(e))).finally(() => setLoading(false));
  };
  useEffect(load, [endpoint]); // eslint-disable-line

  const openNew = () => setEditing({ id: null, values: { ...blank } });
  const openEdit = (item) => {
    const values = { ...blank };
    fields.forEach((f) => {
      if (f.type === 'password') values[f.name] = '';
      else if (f.type === 'lines') values[f.name] = (item[f.name] || []).join('\n');
      else values[f.name] = item[f.name] ?? blank[f.name];
    });
    setEditing({ id: item._id, values });
  };

  const setValue = (name, v) => setEditing((e) => ({ ...e, values: { ...e.values, [name]: v } }));

  const save = async (e) => {
    e.preventDefault();
    const body = { ...editing.values };
    fields.forEach((f) => {
      if (f.type === 'lines') body[f.name] = String(body[f.name] || '').split('\n').map((s) => s.trim()).filter(Boolean);
      if (f.type === 'number') body[f.name] = Number(body[f.name] || 0);
      if (f.type === 'password' && !body[f.name]) delete body[f.name];
    });
    setSaving(true);
    try {
      if (editing.id) await api.put(`${endpoint}/${editing.id}`, body);
      else await api.post(endpoint, body);
      toast.success(editing.id ? `${noun} updated.` : `${noun} created.`);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete this ${noun.toLowerCase()}? This cannot be undone.`)) return;
    try {
      await api.delete(`${endpoint}/${item._id}`);
      toast.success(`${noun} deleted.`);
      load();
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  const shown = items.filter((i) => searchKeys.some((k) => String(i[k] || '').toLowerCase().includes(search.toLowerCase())));

  return (
    <div>
      <div className="admin-head">
        <div><h1>{title}</h1><p className="muted">{items.length} total</p></div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={18} /> Add {noun.toLowerCase()}</button>
      </div>

      <div className="panel">
        <label className="search wide"><Search size={16} /><input placeholder={`Search ${title.toLowerCase()}`} value={search} onChange={(e) => setSearch(e.target.value)} /></label>
        <div className="table-wrap">
          <table className="table">
            <thead><tr>{columns.map((c) => <th key={c.label}>{c.label}</th>)}<th className="right">Actions</th></tr></thead>
            <tbody>
              {shown.map((item) => (
                <tr key={item._id}>
                  {columns.map((c) => <td key={c.label}>{c.render ? c.render(item) : item[c.key]}</td>)}
                  <td className="right actions">
                    <button className="icon-btn" onClick={() => openEdit(item)} aria-label="Edit"><Pencil size={16} /></button>
                    <button className="icon-btn danger" onClick={() => remove(item)} aria-label="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <p className="empty">Loading...</p>}
          {!loading && shown.length === 0 && <p className="empty">Nothing here yet. Click "Add {noun.toLowerCase()}" to create one.</p>}
        </div>
      </div>

      {editing && (
        <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="modal" onSubmit={save} role="dialog" aria-modal="true" aria-label={`${editing.id ? 'Edit' : 'Add'} ${noun}`}>
            <div className="modal-head">
              <h2>{editing.id ? 'Edit' : 'Add'} {noun.toLowerCase()}</h2>
              <button type="button" className="icon-btn" onClick={() => setEditing(null)} aria-label="Close"><X size={20} /></button>
            </div>
            <div className="modal-body form-grid">
              {fields.map((f) => <Field key={f.name} f={f.name === 'password' ? { ...f, required: !editing.id, help: editing.id ? 'Leave blank to keep the current password.' : f.help } : f} value={editing.values[f.name]} onChange={(v) => setValue(f.name, v)} />)}
            </div>
            <div className="modal-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
