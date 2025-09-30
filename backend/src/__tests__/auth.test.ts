import request from 'supertest';
import createApp from '../app';
import { User } from '../models/User';

const app = createApp();

describe('Auth Endpoints', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPassword123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
      expect(res.body.data.user.name).toBe(testUser.name);
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should not register user with invalid email', async () => {
      const invalidUser = { ...testUser, email: 'invalid-email' };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should not register user with short password', async () => {
      const invalidUser = { ...testUser, password: '123' };
      
      const res = await request(app)
        .post('/api/auth/register')
        .send(invalidUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Validation failed');
    });

    it('should not register user with duplicate email', async () => {
      // Create first user
      await User.create(testUser);

      // Try to create another user with same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('User with this email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await User.create(testUser);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should not login with invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid credentials');
    });

    it('should not login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Register and login to get token
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      authToken = res.body.data.token;
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
      expect(res.body.data.name).toBe(testUser.name);
    });

    it('should not get current user without token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not authorized to access this route');
    });

    it('should not get current user with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalidtoken')
        .expect(401);

      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Not authorized to access this route');
    });
  });
});