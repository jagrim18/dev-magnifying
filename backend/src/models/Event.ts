import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  type: 'visit' | 'inquiry';
  productId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  type: {
    type: String,
    enum: ['visit', 'inquiry'],
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
});

export default mongoose.model<IEvent>('Event', EventSchema);
