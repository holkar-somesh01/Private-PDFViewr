import mongoose, { Document, Schema } from 'mongoose';

export interface IPhase extends Document {
  name: string;
  description: string;
  coverImagePath: string;
  order: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const phaseSchema = new Schema<IPhase>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImagePath: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const Phase = mongoose.model<IPhase>('Phase', phaseSchema);

export default Phase;
