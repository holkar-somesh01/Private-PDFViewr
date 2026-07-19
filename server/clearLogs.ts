import { connectDB } from './src/config/db.js';
import { ActivityLog } from './src/models/index.js';
import mongoose from 'mongoose';

const clearLogs = async () => {
  try {
    await connectDB();
    const result = await ActivityLog.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} logs.`);
  } catch (error) {
    console.error('Error deleting logs:', error);
  } finally {
    await mongoose.disconnect();
  }
};

clearLogs();
