import CrudManager from '../../components/CrudManager.jsx';
import { assetUrl, money } from '../../api.js';
import { useSettings } from '../../context/SettingsContext.jsx';
import Mark from '../../components/Mark.jsx';

const pill = (on, yes, no) => <span className={`pill ${on ? 'ok' : 'off'}`}>{on ? yes : no}</span>;
const thumb = (src) => (src ? <img className="mini" src={assetUrl(src)} alt="" /> : <span className="mini ph"><Mark /></span>);

export function ManageServices() {
  return (
    <CrudManager
      title="Services" noun="Service" endpoint="/services" searchKeys={['title', 'category']}
      blank={{ title: '', category: 'General', shortDescription: '', description: '', image: '', features: '', featured: false, active: true }}
      columns={[
        { label: 'Image', render: (i) => thumb(i.image) },
        { label: 'Title', key: 'title' },
        { label: 'Category', key: 'category' },
        { label: 'Featured', render: (i) => pill(i.featured, 'Yes', 'No') },
        { label: 'Status', render: (i) => pill(i.active, 'Visible', 'Hidden') },
      ]}
      fields={[
        { name: 'title', label: 'Title', required: true },
        { name: 'category', label: 'Category', help: 'Used to group services in the mega menu.' },
        { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2, wide: true },
        { name: 'description', label: 'Full description', type: 'textarea', rows: 5, wide: true },
        { name: 'features', label: 'What is included', type: 'lines', wide: true, help: 'One item per line.' },
        { name: 'image', label: 'Image', type: 'image', wide: true },
        { name: 'featured', label: 'Show on home page', type: 'checkbox' },
        { name: 'active', label: 'Visible on website', type: 'checkbox' },
      ]}
    />
  );
}

export function ManageProducts() {
  const { settings } = useSettings();
  return (
    <CrudManager
      title="Products" noun="Product" endpoint="/products" searchKeys={['name', 'category']}
      blank={{ name: '', category: 'General', price: 0, shortDescription: '', description: '', image: '', features: '', inStock: true, featured: false, active: true }}
      columns={[
        { label: 'Image', render: (i) => thumb(i.image) },
        { label: 'Name', key: 'name' },
        { label: 'Category', key: 'category' },
        { label: 'Price', render: (i) => (i.price > 0 ? money(i.price, settings.currency) : '-') },
        { label: 'Stock', render: (i) => pill(i.inStock, 'Available', 'Unavailable') },
        { label: 'Status', render: (i) => pill(i.active, 'Visible', 'Hidden') },
      ]}
      fields={[
        { name: 'name', label: 'Name', required: true },
        { name: 'category', label: 'Category', help: 'Used to group products in the mega menu.' },
        { name: 'price', label: `Price (${settings.currency})`, type: 'number', help: 'Use 0 to show "Contact for price".' },
        { name: 'shortDescription', label: 'Short description', type: 'textarea', rows: 2, wide: true },
        { name: 'description', label: 'Full description', type: 'textarea', rows: 5, wide: true },
        { name: 'features', label: 'Key features', type: 'lines', wide: true, help: 'One feature per line.' },
        { name: 'image', label: 'Image', type: 'image', wide: true },
        { name: 'inStock', label: 'Available', type: 'checkbox' },
        { name: 'featured', label: 'Show on home page', type: 'checkbox' },
        { name: 'active', label: 'Visible on website', type: 'checkbox' },
      ]}
    />
  );
}

export function ManageUsers() {
  return (
    <CrudManager
      title="Users" noun="User" endpoint="/users" searchKeys={['name', 'email']}
      blank={{ name: '', email: '', password: '', role: 'user', active: true }}
      columns={[
        { label: 'Name', key: 'name' },
        { label: 'Email', key: 'email' },
        { label: 'Role', render: (i) => <span className={`pill ${i.role === 'admin' ? 'brand' : 'off'}`}>{i.role}</span> },
        { label: 'Status', render: (i) => pill(i.active, 'Active', 'Blocked') },
        { label: 'Joined', render: (i) => new Date(i.createdAt).toLocaleDateString() },
      ]}
      fields={[
        { name: 'name', label: 'Full name', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'password', label: 'Password', type: 'password', minLength: 6 },
        { name: 'role', label: 'Role', type: 'select', options: [{ value: 'user', label: 'User' }, { value: 'admin', label: 'Admin' }] },
        { name: 'active', label: 'Account is active (can log in)', type: 'checkbox' },
      ]}
    />
  );
}
