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

    // List of users to ensure exist
    const usersToCreate = [
      { name: 'Admin User', email: 'admin@hackathon.com', password: 'admin123', role: 'admin' },
      { name: 'Uday', email: 'uday@gmail.com', password: 'user123', role: 'member' },
      { name: 'Uday T', email: 'udattt@gmail.com', password: 'user123', role: 'member' },
      { name: 'New User', email: 'newuser@test.com', password: 'user123', role: 'member' },
      { name: 'Test User', email: 'test@example.com', password: 'user123', role: 'member' },
      { name: 'Test Member', email: 'user@test.com', password: 'user123', role: 'member' }
    ];

    console.log('📊 Creating/Updating all users...\n');
    
    for (const userData of usersToCreate) {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      if (user) {
        // Update existing user
        user.name = userData.name;
        user.password = hashedPassword;
        user.role = userData.role;
        await user.save();
        console.log(`✅ Updated: ${userData.email}`);
      } else {
        // Create new user
        user = await User.create({
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          createdAt: new Date()
        });
        console.log(`✨ Created: ${userData.email}`);
      }
      
      console.log(`   Name: ${userData.name}`);
      console.log(`   Password: ${userData.password}`);
      console.log(`   Role: ${userData.role}\n`);
    }

    console.log('🎉 All users ready!\n');
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 Admin User:');
    console.log('  Email: admin@hackathon.com');
    console.log('  Password: admin123\n');
    console.log('👥 Regular Users:');
    console.log('  Email: uday@gmail.com');
    console.log('  Password: user123\n');
    console.log('  Email: udattt@gmail.com');
    console.log('  Password: user123\n');
    console.log('  Email: newuser@test.com');
    console.log('  Password: user123\n');
    console.log('  Email: test@example.com');
    console.log('  Password: user123\n');
    console.log('  Email: user@test.com');
    console.log('  Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
