const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  avatar: String,
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function monitorNewSignups() {
  try {
    console.log('🔍 Connecting to MongoDB for real-time monitoring...');
    
    await mongoose.connect('mongodb://localhost:27017/hackathon-helper', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected! Monitoring new user signups...\n');
    console.log('📊 Press Ctrl+C to stop monitoring\n');
    
    let lastCount = 0;
    let lastUsers = [];
    
    // Get initial user count
    const initialUsers = await User.find({}).sort({ createdAt: -1 });
    lastCount = initialUsers.length;
    lastUsers = initialUsers.map(u => u._id.toString());
    
    console.log(`📈 Current user count: ${lastCount}`);
    console.log('🔄 Watching for new signups...\n');
    
    // Check for new users every 5 seconds
    setInterval(async () => {
      try {
        const currentUsers = await User.find({}).sort({ createdAt: -1 });
        const currentCount = currentUsers.length;
        
        if (currentCount > lastCount) {
          // New users detected!
          const newUsers = currentUsers.filter(user => 
            !lastUsers.includes(user._id.toString())
          );
          
          console.log(`🚨 NEW USER ALERT! ${newUsers.length} new signup(s) detected!\n`);
          
          newUsers.forEach((user, index) => {
            console.log(`🆕 NEW USER #${index + 1}:`);
            console.log(`   👤 Name: ${user.name}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👑 Role: ${user.role}`);
            console.log(`   📅 Signed Up: ${new Date(user.createdAt).toLocaleString()}`);
            console.log(`   ⏰ Just now!\n`);
          });
          
          lastCount = currentCount;
          lastUsers = currentUsers.map(u => u._id.toString());
          
          console.log(`📊 Total users now: ${currentCount}\n`);
          console.log('🔄 Continuing to monitor...\n');
        }
        
        // Show a heartbeat every 30 seconds
        if (Date.now() % 30000 < 5000) {
          console.log(`💓 Monitoring... Current users: ${currentCount} (${new Date().toLocaleTimeString()})`);
        }
        
      } catch (error) {
        console.error('❌ Monitoring error:', error.message);
      }
    }, 5000); // Check every 5 seconds
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 Stopping user signup monitoring...');
  mongoose.connection.close();
  console.log('✅ Monitoring stopped. Goodbye!\n');
  process.exit(0);
});

console.log('👀 USER SIGNUP MONITOR');
console.log('======================\n');
monitorNewSignups();