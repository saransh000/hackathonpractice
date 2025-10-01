import mongoose from 'mongoose';
import { User } from './src/models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const demoUsers = [
  {
    name: 'Alex Chen',
    email: 'alex@hackathon.com',
    password: 'demo123',
    role: 'admin'
  },
  {
    name: 'Sarah Kim',
    email: 'sarah@hackathon.com',
    password: 'demo123',
    role: 'member'
  },
  {
    name: 'Mike Johnson',
    email: 'mike@hackathon.com',
    password: 'demo123',
    role: 'member'
  },
  {
    name: 'Emma Davis',
    email: 'emma@hackathon.com',
    password: 'demo123',
    role: 'member'
  }
];

async function seedDemoUsers() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-helper';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing demo users (optional)
    const demoEmails = demoUsers.map(u => u.email);
    await User.deleteMany({ email: { $in: demoEmails } });
    console.log('🗑️  Cleared existing demo users');

    // Create demo users
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log('\n🎉 Demo users seeded successfully!');
    console.log('\nYou can now login with:');
    demoUsers.forEach(u => {
      console.log(`  - Email: ${u.email}`);
      console.log(`    Password: demo123`);
      console.log(`    Role: ${u.role}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo users:', error);
    process.exit(1);
  }
}

seedDemoUsers();
