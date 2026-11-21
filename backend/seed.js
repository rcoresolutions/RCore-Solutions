import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Service from './models/Service.js';
import Product from './models/Product.js';
import Setting from './models/Setting.js';

const services = [
  { title: 'Web Development', category: 'Development', featured: true, shortDescription: 'Fast, secure websites and web platforms built for your business goals.', description: 'We build modern websites, portals and e-commerce platforms using React, Node.js and MongoDB. Every project is responsive, SEO-ready and designed to scale as you grow.', features: ['Custom business websites', 'E-commerce platforms', 'Admin dashboards and portals', 'SEO-ready and mobile-first'] },
  { title: 'Mobile App Development', category: 'Development', featured: true, shortDescription: 'Android and iOS apps your customers will enjoy using.', description: 'From idea to app store, we design and build reliable mobile apps with clean interfaces and secure back ends.', features: ['Android and iOS apps', 'API and back-end integration', 'Push notifications', 'App store publishing'] },
  { title: 'UI/UX Design', category: 'Design', featured: true, shortDescription: 'Interfaces that are clear, consistent and easy to use.', description: 'Our designers turn business requirements into simple user flows and polished interfaces, backed by a reusable design system.', features: ['User research and flows', 'Wireframes and prototypes', 'Design systems', 'Usability review'] },
  { title: 'Cloud & DevOps', category: 'Infrastructure', shortDescription: 'Reliable hosting, deployment and monitoring.', description: 'We set up secure cloud infrastructure, automated deployments and monitoring so your systems stay online and fast.', features: ['Cloud setup and migration', 'CI/CD pipelines', 'Backups and monitoring', 'Security hardening'] },
  { title: 'IT Consulting', category: 'Infrastructure', shortDescription: 'Clear technical advice for planning and decision making.', description: 'We review your current systems, identify risks and opportunities, and give you a practical roadmap.', features: ['Technology audits', 'Project planning', 'Vendor selection', 'Team training'] },
  { title: 'Digital Marketing', category: 'Growth', shortDescription: 'Get found online and turn visitors into customers.', description: 'Search optimisation, content and campaign management that connect your business with the right audience.', features: ['SEO and content', 'Social media management', 'Paid campaigns', 'Analytics and reporting'] },
];

const products = [
  { name: 'RCore POS', category: 'Business Software', price: 45000, featured: true, shortDescription: 'Point of sale software for shops and restaurants.', description: 'Fast billing, stock tracking and daily sales reports in one simple system.', features: ['Barcode billing', 'Stock control', 'Daily reports', 'Multi-branch ready'] },
  { name: 'RCore CRM', category: 'Business Software', price: 60000, featured: true, shortDescription: 'Track leads, customers and follow-ups in one place.', description: 'Keep your sales team organised with pipelines, reminders and clear customer history.', features: ['Lead pipeline', 'Follow-up reminders', 'Team access roles', 'Export reports'] },
  { name: 'RCore HR Suite', category: 'Business Software', price: 55000, shortDescription: 'Attendance, leave and payroll for growing teams.', description: 'Manage employee records, attendance and payroll with less paperwork.', features: ['Attendance tracking', 'Leave management', 'Payroll summary', 'Employee profiles'] },
  { name: 'Business Hosting Plan', category: 'Hosting', price: 12000, featured: true, shortDescription: 'Managed hosting with SSL, backups and support.', description: 'Fast, secure hosting for business websites, with daily backups and monitored uptime.', features: ['Free SSL', 'Daily backups', 'Uptime monitoring', 'Priority support'] },
];

await mongoose.connect(process.env.MONGO_URI);

if (!(await Setting.findOne())) {
  await Setting.create({});
  console.log('Created default site settings');
}

const email = (process.env.ADMIN_EMAIL || 'admin@rcoresolutions.com').toLowerCase();
if (!(await User.findOne({ email }))) {
  await User.create({ name: process.env.ADMIN_NAME || 'RCore Admin', email, password: process.env.ADMIN_PASSWORD || 'Admin@12345', role: 'admin' });
  console.log(`Created admin: ${email}`);
} else {
  console.log(`Admin already exists: ${email}`);
}

if ((await Service.countDocuments()) === 0) { await Service.insertMany(services); console.log('Added sample services'); }
if ((await Product.countDocuments()) === 0) { await Product.insertMany(products); console.log('Added sample products'); }

await mongoose.disconnect();
console.log('Seed complete.');
