const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (matching your backend model)
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
    required: true,
    select: false
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
  timestamps: true // This adds createdAt and updatedAt
});

const User = mongoose.model('User', userSchema);

async function showLatestSignedUpUsers() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/hackathon-helper', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('\n📊 LATEST SIGNED UP USERS');
    console.log('==========================\n');
    
    // Get all users sorted by creation date (newest first)
    const users = await User.find({})
      .sort({ createdAt: -1 }) // Sort by newest first
      .select('name email role createdAt updatedAt') // Don't include password
      .limit(10); // Show latest 10 users
    
    if (users.length === 0) {
      console.log('❌ No users found in the database.\n');
      return;
    }
    
    console.log(`📈 Total Users Found: ${users.length}\n`);
    
    users.forEach((user, index) => {
      const userNumber = index + 1;
      const signupDate = new Date(user.createdAt);
      const now = new Date();
      const timeDiff = Math.floor((now - signupDate) / (1000 * 60)); // minutes ago
      
      let timeAgo;
      if (timeDiff < 60) {
        timeAgo = `${timeDiff} minutes ago`;
      } else if (timeDiff < 1440) {
        timeAgo = `${Math.floor(timeDiff / 60)} hours ago`;
      } else {
        timeAgo = `${Math.floor(timeDiff / 1440)} days ago`;
      }
      
      console.log(`👤 User #${userNumber} (Most Recent: ${userNumber === 1 ? 'YES' : 'NO'})`);
      console.log(`   🆔 ID: ${user._id}`);
      console.log(`   📛 Name: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👑 Role: ${user.role === 'admin' ? '🔑 ADMIN' : '👤 MEMBER'}`);
      console.log(`   📅 Signed Up: ${signupDate.toLocaleString()}`);
      console.log(`   ⏰ Time Ago: ${timeAgo}`);
      
      if (user.updatedAt.getTime() !== user.createdAt.getTime()) {
        console.log(`   🔄 Last Updated: ${new Date(user.updatedAt).toLocaleString()}`);
      }
      
      console.log('   ' + '─'.repeat(50));
    });
    
    // Show signup statistics
    console.log('\n📊 SIGNUP STATISTICS:');
    console.log('=====================\n');
    
    const adminCount = users.filter(user => user.role === 'admin').length;
    const memberCount = users.filter(user => user.role === 'member').length;
    
    console.log(`👑 Admin Users: ${adminCount}`);
    console.log(`👤 Member Users: ${memberCount}`);
    console.log(`📊 Total Users: ${users.length}`);
    
    // Show recent signup activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const todaySignups = users.filter(user => new Date(user.createdAt) >= today).length;
    const yesterdaySignups = users.filter(user => {
      const signupDate = new Date(user.createdAt);
      return signupDate >= yesterday && signupDate < today;
    }).length;
    const thisWeekSignups = users.filter(user => new Date(user.createdAt) >= thisWeek).length;
    
    console.log('\n📈 RECENT ACTIVITY:');
    console.log('==================');
    console.log(`📅 Today: ${todaySignups} new signups`);
    console.log(`📅 Yesterday: ${yesterdaySignups} new signups`);
    console.log(`📅 This Week: ${thisWeekSignups} new signups`);
    
    // Show the most recent user
    if (users.length > 0) {
      const latestUser = users[0];
      console.log('\n🆕 MOST RECENT USER:');
      console.log('===================');
      console.log(`👤 ${latestUser.name} (${latestUser.email})`);
      console.log(`👑 Role: ${latestUser.role}`);
      console.log(`📅 Joined: ${new Date(latestUser.createdAt).toLocaleString()}`);
    }
    
    console.log('\n✅ Latest users report complete!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.\n');
  }
}

// Run the function
showLatestSignedUpUsers();