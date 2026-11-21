import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'], trim: true },
    category: { type: String, trim: true, default: 'General' },
    price: { type: Number, min: [0, 'Price cannot be negative.'], default: 0 },
    shortDescription: { type: String, trim: true, maxlength: 240, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    features: [{ type: String, trim: true }],
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
