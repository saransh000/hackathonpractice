// Database Viewer Script
// Run this with: node viewDatabase.js

const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hackathon-helper');

// User Schema (simplified for viewing)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  role: String,
  createdAt: Date,
  updatedAt: Date
});

const User = mongoose.model('User', userSchema);

async function viewDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Get all users (excluding passwords for security)
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    
    console.log('\n📊 HACKATHON HELPER - USER DATABASE');
    console.log('=====================================');
    console.log(`Total Users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database.');
      console.log('💡 Register a user at http://localhost:5173 first!');
    } else {
      users.forEach((user, index) => {
        console.log(`👤 User ${index + 1}:`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Avatar: ${user.avatar || 'None'}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Updated: ${user.updatedAt}`);
        console.log('   ---');
      });
    }
    
    // Show database statistics
    const stats = await mongoose.connection.db.stats();
    console.log('\n📈 Database Statistics:');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Collections: ${stats.collections}`);
    console.log(`   Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure MongoDB is running: net start MongoDB');
    console.log('2. Check if mongod is running on port 27017');
    console.log('3. Verify MongoDB installation');
  } finally {
    mongoose.disconnect();
  }
}

// Run the viewer
viewDatabase();