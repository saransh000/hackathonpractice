const { MongoClient } = require('mongodb');

async function viewDatabase() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('hackathon-helper');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📚 Collections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check users collection
    const usersCollection = db.collection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`\n👥 Users collection contains ${userCount} documents`);
    
    if (userCount > 0) {
      console.log('\n📄 Sample user documents:');
      const users = await usersCollection.find({}).limit(5).toArray();
      users.forEach((user, index) => {
        console.log(`\nUser ${index + 1}:`);
        console.log(`- ID: ${user._id}`);
        console.log(`- Name: ${user.name}`);
        console.log(`- Email: ${user.email}`);
        console.log(`- Created: ${user.createdAt}`);
        // Don't show password for security
      });
    } else {
      console.log('\n📭 No users found. Try signing up on the website first!');
    }
    
    // Check tasks collection
    const tasksCollection = db.collection('tasks');
    const taskCount = await tasksCollection.countDocuments();
    console.log(`\n📝 Tasks collection contains ${taskCount} documents`);
    
    // Check boards collection
    const boardsCollection = db.collection('boards');
    const boardCount = await boardsCollection.countDocuments();
    console.log(`📋 Boards collection contains ${boardCount} documents`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('\n🔐 Connection closed');
  }
}

viewDatabase();