# Hackathon Helper Backend

A RESTful API backend for the Hackathon Helper Tool - a lightweight Kanban board application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- **Authentication**: JWT-based user authentication with registration and login
- **Task Management**: Full CRUD operations for tasks with priority, status, and assignment
- **Board Management**: Create and manage Kanban boards with custom columns
- **Team Collaboration**: Add team members to boards and assign tasks
- **Data Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Testing**: Unit tests with Jest and Supertest

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Jest** - Testing framework

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd hackathon-helper-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hackathon-helper
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

5. Start MongoDB (if running locally)

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

**Run tests:**
```bash
npm test
npm run test:watch  # Watch mode
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users
- `GET /api/users` - Get all users (Protected)
- `GET /api/users/:id` - Get user by ID (Protected)

### Boards
- `GET /api/boards` - Get all boards (Protected)
- `POST /api/boards` - Create new board (Protected)
- `GET /api/boards/:id` - Get board with tasks (Protected)
- `PUT /api/boards/:id` - Update board (Protected)
- `DELETE /api/boards/:id` - Delete board (Protected)
- `POST /api/boards/:id/members` - Add team member (Protected)
- `DELETE /api/boards/:id/members/:userId` - Remove team member (Protected)

### Tasks
- `GET /api/tasks` - Get all tasks (Protected)
- `POST /api/tasks` - Create new task (Protected)
- `GET /api/tasks/:id` - Get task by ID (Protected)
- `PUT /api/tasks/:id` - Update task (Protected)
- `DELETE /api/tasks/:id` - Delete task (Protected)

## API Documentation

### Sample Request/Response

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "user-id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "member"
    }
  }
}
```

**Create Task:**
```json
POST /api/tasks
Authorization: Bearer <jwt-token>
{
  "title": "Implement user authentication",
  "description": "Add JWT-based auth to the application",
  "priority": "high",
  "boardId": "board-id",
  "column": "todo"
}

Response:
{
  "success": true,
  "data": {
    "_id": "task-id",
    "title": "Implement user authentication",
    "description": "Add JWT-based auth to the application",
    "status": "pending",
    "priority": "high",
    "column": "todo",
    "board": "board-id",
    "createdBy": "user-id",
    "createdAt": "2023-...",
    "updatedAt": "2023-..."
  }
}
```

## Project Structure

```
src/
├── config/
│   └── database.ts          # MongoDB connection
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── boardController.ts   # Board management
│   ├── taskController.ts    # Task management
│   └── userController.ts    # User operations
├── middleware/
│   ├── auth.ts             # JWT authentication
│   ├── errorHandler.ts     # Error handling
│   └── notFound.ts         # 404 handler
├── models/
│   ├── Board.ts            # Board schema
│   ├── Task.ts             # Task schema
│   └── User.ts             # User schema
├── routes/
│   ├── auth.ts             # Auth routes
│   ├── boards.ts           # Board routes
│   ├── tasks.ts            # Task routes
│   └── users.ts            # User routes
├── types/
│   └── index.ts            # TypeScript types
├── __tests__/
│   ├── setup.ts            # Test configuration
│   └── auth.test.ts        # Auth tests
├── app.ts                  # Express app setup
└── server.ts               # Server entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/hackathon-helper` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | CORS allowed origin | `http://localhost:5173` |

## Testing

The backend includes comprehensive tests using Jest and Supertest:

- **Authentication tests**: Registration, login, token validation
- **In-memory MongoDB**: Tests use MongoDB Memory Server
- **Test isolation**: Each test runs in a clean database state

Run tests with:
```bash
npm test
npm run test:watch  # Watch mode for development
```

## Security Features

- **Password hashing** with bcryptjs
- **JWT authentication** for protected routes
- **Input validation** with express-validator
- **CORS protection**
- **Helmet** for security headers
- **Rate limiting** ready (can be added)

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "error": "Error message here",
  "details": [] // Validation errors if applicable
}
```

HTTP status codes follow REST conventions:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License