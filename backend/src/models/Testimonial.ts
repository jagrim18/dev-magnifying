import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role: string;
  text: string;
  rating: number;
}

const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String },
  text: { type: String, required: true },
  rating: { type: Number, default: 5 }
}, {
  timestamps: true
});

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
