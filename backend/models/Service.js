import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required.'], trim: true },
    category: { type: String, trim: true, default: 'General' },
    shortDescription: { type: String, trim: true, maxlength: 240, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    features: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
