const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://127.0.0.1:27017/hackathon-helper')
  .then(async () => {
    console.log('🔌 Connected to MongoDB\n');

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: Date
    });

    const User = mongoose.model('User', userSchema);

    // Update all users with default password
    const users = await User.find({});
    
    console.log('📊 Updating passwords for all users...\n');
    
    for (const user of users) {
      // Set password based on role
      const defaultPassword = user.role === 'admin' ? 'admin123' : 'user123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);
      
      user.password = hashedPassword;
      await user.save();
      
      console.log(`✅ Updated: ${user.email}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log(`   Role: ${user.role}\n`);
    }

    console.log('🎉 All passwords updated!\n');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin User:');
    console.log('  Email: admin@hackathon.com');
    console.log('  Password: admin123\n');
    console.log('Regular Users:');
    console.log('  Email: uday@gmail.com');
    console.log('  Password: user123\n');
    console.log('  Email: udattt@gmail.com');
    console.log('  Password: user123\n');
    console.log('  Email: newuser@test.com');
    console.log('  Password: user123\n');
    console.log('  Email: test@example.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
