import request from 'supertest';
import app from '../server';
import { User } from '../models/User';
import { Project } from '../models/Project';
import mongoose from 'mongoose';

describe('Project API', () => {
  let authToken: string;
  let studentId: string;
  let projectId: string;

  beforeAll(async () => {
    // Create a test student user
    const student = new User({
      email: 'student@test.com',
      firstName: 'Test',
      lastName: 'Student',
      mobile: '+1234567890',
      role: 'student',
      password: 'password123',
      isEmailVerified: true,
      isMobileVerified: true
    });

    await student.save();
    studentId = student._id.toString();

    // Login to get auth token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'student@test.com',
        password: 'password123'
      });

    authToken = loginRes.body.data.token;
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({ email: 'student@test.com' });
    await Project.deleteMany({ studentId });
    await mongoose.connection.close();
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Project',
          description: 'This is a test project',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          deliverables: ['Report', 'Code'],
          tags: ['javascript', 'nodejs']
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Project');
      projectId = res.body.data._id;
    });

    it('should fail to create project without required fields', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Project'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/projects/my-projects', () => {
    it('should retrieve student projects', async () => {
      const res = await request(app)
        .get('/api/v1/projects/my-projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/v1/projects/:id', () => {
    it('should retrieve a specific project', async () => {
      const res = await request(app)
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(projectId);
    });
  });

  describe('PUT /api/v1/projects/:id', () => {
    it('should update a project', async () => {
      const res = await request(app)
        .put(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Test Project',
          description: 'This is an updated test project'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Test Project');
    });
  });

  describe('DELETE /api/v1/projects/:id', () => {
    it('should delete a project', async () => {
      const res = await request(app)
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});