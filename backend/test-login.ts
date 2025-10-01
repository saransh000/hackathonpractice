import mongoose from 'mongoose';
import { User } from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

async function testLogin() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-helper';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB\n');

    const testEmail = 'alex@hackathon.com';
    const testPassword = 'demo123';

    console.log(`🔍 Testing login for: ${testEmail}`);
    console.log(`🔑 Password: ${testPassword}\n`);

    // Find user with password field
    const user = await User.findOne({ email: testEmail }).select('+password');
    
    if (!user) {
      console.log('❌ User not found in database!');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password.substring(0, 20)}...`);
    console.log();

    // Test password match
    const isMatch = await user.matchPassword(testPassword);
    
    if (isMatch) {
      console.log('✅ Password matches! Login should work.');
    } else {
      console.log('❌ Password does NOT match!');
      console.log('   The password in database is different from "demo123"');
    }

    // Show all users
    console.log('\n📋 All users in database:');
    const allUsers = await User.find({}).select('-password');
    allUsers.forEach(u => {
      console.log(`   - ${u.name} (${u.email}) - ${u.role}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();
