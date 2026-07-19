import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginLog extends Document {
  userId: mongoose.Types.ObjectId | null;
  emailAttempted: string;
  ipAddress: string;
  userAgent: string;
  status: 'Success' | 'Failed';
  createdAt: Date;
  updatedAt: Date;
}

const loginLogSchema = new Schema<ILoginLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    emailAttempted: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Success', 'Failed'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LoginLog = mongoose.model<ILoginLog>('LoginLog', loginLogSchema);

export default LoginLog;
