import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required.'], trim: true, maxlength: 80 },
    email: { type: String, required: [true, 'Email is required.'], trim: true, match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.'] },
    phone: { type: String, trim: true, default: '' },
    subject: { type: String, trim: true, default: '', maxlength: 150 },
    message: { type: String, required: [true, 'Message is required.'], trim: true, maxlength: 3000 },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Message', messageSchema);
