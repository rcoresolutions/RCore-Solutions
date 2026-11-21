import mongoose from 'mongoose';

const s = (def = '') => ({ type: String, default: def, trim: true });

const settingSchema = new mongoose.Schema(
  {
    siteName: s('RCore Solutions'),
    tagline: s('Technology that runs the core of your business'),
    logoUrl: s('/logo.jpeg'),
    primaryColor: s('#FC6E02'),
    heroTitle: s('Technology that runs the core of your business.'),
    heroSubtitle: s('We design, build and support software, platforms and digital products that help companies grow with confidence.'),
    aboutTitle: s('Built around your core'),
    aboutText: s('RCore Solutions is a technology partner for growing businesses. Our team plans, builds and supports websites, applications and business systems that are reliable, secure and easy to use.\n\nWe work closely with each client, from the first conversation to long-term support, so every solution fits the way your business actually runs.'),
    whatsappNumber: s('923000000000'),
    whatsappMessage: s('Hello RCore Solutions, I would like to know more about your services.'),
    email: s('info@rcoresolutions.com'),
    phone: s('+92 300 0000000'),
    address: s('Karachi, Pakistan'),
    workingHours: s('Mon - Sat, 9:00 AM - 6:00 PM'),
    currency: s('PKR'),
    facebook: s(''),
    instagram: s(''),
    linkedin: s(''),
    twitter: s(''),
    footerText: s('Reliable technology solutions for modern businesses.'),
  },
  { timestamps: true }
);

export default mongoose.model('Setting', settingSchema);
