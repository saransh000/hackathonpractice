// Create Admin User Script
const mongoose = require('mongoose');

// User Schema (same as in the main app)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/hackathon-helper');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('👑 Admin user already exists:');
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Created: ${existingAdmin.createdAt}`);
    } else {
      // Create admin user with bcrypt hashed password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@hackathon.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin user created successfully!');
      console.log('👑 Admin Login Credentials:');
      console.log('   Email: admin@hackathon.com');
      console.log('   Password: Admin123!');
      console.log('   Role: admin');
    }
    
    // Show current user stats
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const memberCount = await User.countDocuments({ role: 'member' });
    
    console.log('\n📊 Current Database Stats:');
    console.log(`   Total Users: ${totalUsers}`);
    console.log(`   Admins: ${adminCount}`);
    console.log(`   Members: ${memberCount}`);
    
    await mongoose.connection.close();
    console.log('\n🔐 Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminUser();