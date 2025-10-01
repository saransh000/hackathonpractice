const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hackathon-helper')
  .then(async () => {
    console.log('🔌 Connected to MongoDB');

    // Define User schema inline
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      role: String,
      createdAt: Date
    });

    const User = mongoose.model('User', userSchema);

    // Find admin user
    const admin = await User.findOne({ email: 'admin@hackathon.com' });

    if (admin) {
      console.log('\n✅ Admin user found:');
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      
      // Set new password
      const newPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      admin.password = hashedPassword;
      await admin.save();
      
      console.log('\n🔑 Password updated successfully!');
      console.log('   New password: admin123');
      console.log('\n📋 Use these credentials to login:');
      console.log('   Email: admin@hackathon.com');
      console.log('   Password: admin123');
    } else {
      console.log('\n❌ Admin user not found in database');
      console.log('   Creating new admin user...');
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        name: 'Admin User',
        email: 'admin@hackathon.com',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      });
      
      console.log('\n✅ Admin user created!');
      console.log('   Email: admin@hackathon.com');
      console.log('   Password: admin123');
    }

    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
