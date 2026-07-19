import User from './models/User.js';
import mongoose, { connectDB } from './config/db.js';

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = 'ayursangrahsoftware@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists!');
      mongoose.connection.close();
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: adminEmail,
      mobile: '1234567890',
      password: 'Pass@123',
      role: 'Admin',
    });

    console.log('Admin user created successfully.');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: Pass@123');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error);
    process.exit(1);
  }
};

seedAdmin();
