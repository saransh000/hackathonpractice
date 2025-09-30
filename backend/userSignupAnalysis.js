// User Signup Data Analysis Script
const mongoose = require('mongoose');

async function analyzeUserSignups() {
  try {
    console.log('🔍 Connecting to MongoDB...\n');
    await mongoose.connect('mongodb://localhost:27017/hackathon-helper');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Get all users with detailed signup information
    const users = await usersCollection.find({}).sort({ createdAt: 1 }).toArray();
    
    console.log('👥 USER SIGNUP ANALYSIS');
    console.log('========================\n');
    
    if (users.length === 0) {
      console.log('❌ No user signups found in database.');
      console.log('💡 Users need to register through the website first!');
      return;
    }
    
    console.log(`📊 Total Registered Users: ${users.length}\n`);
    
    users.forEach((user, index) => {
      const signupDate = new Date(user.createdAt);
      const daysSinceSignup = Math.floor((new Date() - signupDate) / (1000 * 60 * 60 * 24));
      
      console.log(`${index + 1}. 📝 USER SIGNUP DETAILS:`);
      console.log('   ══════════════════════');
      console.log(`   🆔 MongoDB ID: ${user._id}`);
      console.log(`   👤 Full Name: "${user.name}"`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👑 Account Type: ${user.role.toUpperCase()}`);
      console.log(`   🖼️  Profile Avatar: ${user.avatar || 'Not uploaded'}`);
      console.log(`   📅 Signup Date: ${signupDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`);
      console.log(`   ⏰ Signup Time: ${signupDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })}`);
      console.log(`   📈 Days Since Signup: ${daysSinceSignup} days`);
      console.log(`   🔒 Password Security: bcrypt encrypted (${user.password.length} characters)`);
      console.log(`   🔄 Last Profile Update: ${new Date(user.updatedAt).toLocaleDateString()}`);
      console.log(`   📦 Document Version: ${user.__v}`);
      
      // Show password pattern (first few characters for security demo)
      const passwordPreview = user.password.substring(0, 15) + '...';
      console.log(`   🛡️  Password Hash Preview: ${passwordPreview}`);
      
      console.log('   ───────────────────────\n');
    });
    
    // Signup statistics
    console.log('📈 SIGNUP STATISTICS:');
    console.log('═══════════════════');
    
    const adminCount = users.filter(u => u.role === 'admin').length;
    const memberCount = users.filter(u => u.role === 'member').length;
    
    console.log(`   👑 Admin Accounts: ${adminCount}`);
    console.log(`   👤 Member Accounts: ${memberCount}`);
    
    // Recent signups (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const recentSignups = users.filter(u => new Date(u.createdAt) > yesterday);
    
    console.log(`   🔥 Recent Signups (24h): ${recentSignups.length}`);
    
    if (users.length > 0) {
      const oldestUser = users[0];
      const newestUser = users[users.length - 1];
      
      console.log(`   🥇 First User: ${oldestUser.name} (${oldestUser.email})`);
      console.log(`   🆕 Latest User: ${newestUser.name} (${newestUser.email})`);
    }
    
    // Database size info
    const stats = await db.stats();
    console.log(`\n💾 Database Storage:`);
    console.log(`   Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   Documents: ${stats.objects}`);
    
    await mongoose.connection.close();
    console.log('\n✅ User signup analysis complete!');
    
  } catch (error) {
    console.error('❌ Error analyzing user signups:', error.message);
  }
}

// Run the analysis
analyzeUserSignups();