// Enhanced Database Viewer - Shows all data in MongoDB
const mongoose = require('mongoose');

async function showCompleteDatabase() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect('mongodb://localhost:27017/hackathon-helper');
    
    const db = mongoose.connection.db;
    
    console.log('\n🗄️  HACKATHON HELPER - COMPLETE DATABASE CONTENTS');
    console.log('==================================================');
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📊 Total Collections: ${collections.length}`);
    
    collections.forEach(collection => {
      console.log(`   📁 ${collection.name}`);
    });
    
    // Users Collection - Detailed View
    console.log('\n👥 USERS COLLECTION (DETAILED VIEW):');
    console.log('═══════════════════════════════════');
    
    const usersCollection = db.collection('users');
    const users = await usersCollection.find({}).toArray();
    
    if (users.length > 0) {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. 🆔 User ID: ${user._id}`);
        console.log(`   👤 Name: "${user.name}"`);
        console.log(`   📧 Email: "${user.email}"`);
        console.log(`   🔒 Password Hash: ${user.password.substring(0, 30)}... (bcrypt encrypted)`);
        console.log(`   👑 Role: ${user.role || 'member'}`);
        console.log(`   🖼️  Avatar: ${user.avatar || 'Not set'}`);
        console.log(`   📅 Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log(`   🔄 Updated: ${new Date(user.updatedAt).toLocaleString()}`);
        console.log(`   🔢 Version: ${user.__v || 0}`);
      });
    } else {
      console.log('   ❌ No users found');
    }
    
    // Tasks Collection
    console.log('\n📝 TASKS COLLECTION:');
    console.log('═══════════════════');
    
    const tasksCollection = db.collection('tasks');
    const tasks = await tasksCollection.find({}).toArray();
    
    if (tasks.length > 0) {
      tasks.forEach((task, index) => {
        console.log(`\n${index + 1}. Task: "${task.title}"`);
        console.log(`   📄 Description: ${task.description || 'No description'}`);
        console.log(`   🎯 Status: ${task.status}`);
        console.log(`   👤 Created by: ${task.createdBy}`);
        console.log(`   📅 Created: ${new Date(task.createdAt).toLocaleString()}`);
      });
    } else {
      console.log('   ❌ No tasks found');
    }
    
    // Boards Collection
    console.log('\n📋 BOARDS COLLECTION:');
    console.log('════════════════════');
    
    const boardsCollection = db.collection('boards');
    const boards = await boardsCollection.find({}).toArray();
    
    if (boards.length > 0) {
      boards.forEach((board, index) => {
        console.log(`\n${index + 1}. Board: "${board.name}"`);
        console.log(`   📄 Description: ${board.description || 'No description'}`);
        console.log(`   👤 Owner: ${board.owner}`);
        console.log(`   📅 Created: ${new Date(board.createdAt).toLocaleString()}`);
      });
    } else {
      console.log('   ❌ No boards found');
    }
    
    // Database Statistics
    const stats = await db.stats();
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('═══════════════════════');
    console.log(`   🗃️  Database Name: ${db.databaseName}`);
    console.log(`   📁 Collections: ${stats.collections}`);
    console.log(`   📦 Data Size: ${(stats.dataSize / 1024).toFixed(2)} KB`);
    console.log(`   📇 Index Size: ${(stats.indexSize / 1024).toFixed(2)} KB`);
    console.log(`   📄 Documents: ${stats.objects || 0}`);
    
    // Raw MongoDB Document Structure
    if (users.length > 0) {
      console.log('\n🔍 RAW MONGODB DOCUMENT STRUCTURE:');
      console.log('═══════════════════════════════════');
      console.log('Sample User Document (JSON):');
      console.log(JSON.stringify(users[0], null, 2));
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Database inspection complete!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the enhanced viewer
showCompleteDatabase();