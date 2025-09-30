// MongoDB Commands to View Database Data
// You can run these in MongoDB shell or Compass

// 1. Connect to MongoDB shell
// mongosh "mongodb://localhost:27017"

// 2. Switch to your database
use hackathonhelper

// 3. View all collections
show collections

// 4. View all users (if any exist)
db.users.find().pretty()

// 5. Count total users
db.users.countDocuments()

// 6. View users without passwords (more secure)
db.users.find({}, {password: 0}).pretty()

// 7. View latest users first
db.users.find({}, {password: 0}).sort({createdAt: -1}).pretty()

// 8. Find user by email
db.users.findOne({"email": "test@example.com"}, {password: 0})

// 9. View all tasks (if any)
db.tasks.find().pretty()

// 10. View all boards (if any) 
db.boards.find().pretty()

// Expected User Document Structure:
/*
{
  "_id": ObjectId("..."),
  "name": "John Doe", 
  "email": "john@example.com",
  "password": "$2a$10$hashed.password.here",
  "avatar": "",
  "role": "member",
  "createdAt": ISODate("2025-09-30T..."),
  "updatedAt": ISODate("2025-09-30T..."),
  "__v": 0
}
*/