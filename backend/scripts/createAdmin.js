// Script to create an admin user
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'member' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hackathon-helper');
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@hackathon.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@hackathon.com');
      console.log('Password: admin123');
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Updated existing user to admin role');
      }
    } else {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Create admin user
      const admin = await User.create({
        name: 'Admin User',
        email: 'admin@hackathon.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('✅ Admin user created successfully!');
      console.log('\n📧 Email: admin@hackathon.com');
      console.log('🔑 Password: admin123');
      console.log('👤 Role: admin');
    }

    // Create a regular test user too
    const existingUser = await User.findOne({ email: 'user@test.com' });
    
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('user123', salt);

      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'member',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      console.log('\n✅ Test user created successfully!');
      console.log('📧 Email: user@test.com');
      console.log('🔑 Password: user123');
      console.log('👤 Role: member');
    }

    console.log('\n🎉 Setup complete! You can now login with these credentials.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAdmin();
