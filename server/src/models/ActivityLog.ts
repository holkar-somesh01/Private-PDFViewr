import mongoose, { Document, Schema } from 'mongoose';

export interface IActivityLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: string; // Keep as a general description if needed, or route name
  method: string;
  endpoint: string;
  details: string; // Will store JSON string of body/params
  ipAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // Some actions might be unauthenticated (like login failures), so we don't strictly require it
    },
    action: {
      type: String,
      required: true,
    },
    method: {
      type: String,
      default: '',
    },
    endpoint: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLog;
