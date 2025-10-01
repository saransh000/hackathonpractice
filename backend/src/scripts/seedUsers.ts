import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

// Load env vars
dotenv.config();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@hackathon.com',
    password: 'admin123',
    role: 'admin' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  },
  {
    name: 'Uday Kumar',
    email: 'uday@gmail.com',
    password: 'user123',
    role: 'member' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Uday'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    password: 'user123',
    role: 'member' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya'
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@gmail.com',
    password: 'user123',
    role: 'member' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul'
  },
  {
    name: 'Sneha Patel',
    email: 'sneha@gmail.com',
    password: 'user123',
    role: 'member' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha'
  },
  {
    name: 'Arjun Singh',
    email: 'arjun@gmail.com',
    password: 'user123',
    role: 'member' as const,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun'
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hackathon-helper';
    
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected');

    // Delete existing users
    console.log('🗑️  Deleting existing users...');
    await User.deleteMany({});
    console.log('✅ Existing users deleted');

    // Create new users
    console.log('👥 Creating sample users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ ${createdUsers.length} users created successfully!`);

    // Display created users
    console.log('\n📋 Sample Users:');
    console.log('=====================================');
    for (const user of createdUsers) {
      console.log(`Name: ${user.name}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${sampleUsers.find(u => u.email === user.email)?.password}`);
      console.log(`Role: ${user.role}`);
      console.log(`ID: ${user._id}`);
      console.log('-------------------------------------');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n💡 You can now login with:');
    console.log('   Admin: admin@hackathon.com / admin123');
    console.log('   User:  uday@gmail.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedUsers();
