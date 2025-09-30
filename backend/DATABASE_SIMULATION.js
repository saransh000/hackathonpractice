// MongoDB Database Simulation
// Collection: users
// Database: hackathon-helper

// Sample User Documents After Registration:

[
  {
    "_id": ObjectId("67012a4f1234567890abcdef"),
    "name": "John Doe",
    "email": "john@example.com",
    "password": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
    "avatar": "",
    "role": "member",
    "createdAt": ISODate("2025-09-30T13:15:30.123Z"),
    "updatedAt": ISODate("2025-09-30T13:15:30.123Z"),
    "__v": 0
  },
  {
    "_id": ObjectId("67012b5f1234567890abcd00"),
    "name": "Jane Smith", 
    "email": "jane@gmail.com",
    "password": "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
    "avatar": "",
    "role": "member", 
    "createdAt": ISODate("2025-09-30T13:18:45.456Z"),
    "updatedAt": ISODate("2025-09-30T13:18:45.456Z"),
    "__v": 0
  },
  {
    "_id": ObjectId("67012c6f1234567890abcd11"),
    "name": "Alice Johnson",
    "email": "alice@company.com", 
    "password": "$2a$10$NpZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lS",
    "avatar": "https://example.com/avatar.jpg",
    "role": "admin",
    "createdAt": ISODate("2025-09-30T14:22:10.789Z"),
    "updatedAt": ISODate("2025-09-30T14:25:33.012Z"),
    "__v": 0
  }
]

// MongoDB Query Examples:

// 1. Find all users
db.users.find()

// 2. Find user by email
db.users.findOne({"email": "john@example.com"})

// 3. Count total users
db.users.countDocuments()

// 4. Find users created today
db.users.find({
  "createdAt": {
    $gte: ISODate("2025-09-30T00:00:00.000Z"),
    $lt: ISODate("2025-10-01T00:00:00.000Z")
  }
})

// 5. Find admin users only
db.users.find({"role": "admin"})

// 6. Find users without password field (security)
db.users.find({}, {"password": 0})

/* 
Key Database Details:

1. Collection Name: "users"
2. Database Name: "hackathon-helper" 
3. Connection: mongodb://localhost:27017/hackathon-helper

4. Field Types:
   - _id: ObjectId (MongoDB auto-generated)
   - name: String (trimmed, 2-50 chars)
   - email: String (unique, lowercase)
   - password: String (bcrypt hashed)
   - avatar: String (URL or empty)
   - role: String (enum: "admin" | "member")
   - createdAt: Date (auto-generated)
   - updatedAt: Date (auto-updated)
   - __v: Number (version key)

5. Indexes:
   - _id: Primary key (auto)
   - email: Unique index
*/