import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import User from './src/models/User.js';
import Phase from './src/models/Phase.js';

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ayurdnyanam');
    const users = await User.find({});
    console.log('Users:');
    users.forEach(u => console.log(u.email, u.assignedPhases));
    
    const phases = await Phase.find({});
    console.log('Phases:', phases.map(p => ({ id: p._id, name: p.name })));
    
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
check();
