import mongoose, { Document, Schema } from 'mongoose';

export interface IPDF extends Document {
  title: string;
  description: string;
  thumbnailPath: string;
  filePath: string;
  status: string;
  phaseId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const pdfSchema = new Schema<IPDF>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnailPath: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    phaseId: {
      type: Schema.Types.ObjectId,
      ref: 'Phase',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const PDF = mongoose.model<IPDF>('PDF', pdfSchema);

export default PDF;
