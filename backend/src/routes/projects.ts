import { Router } from 'express';
import { 
  createProject,
  getStudentProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMentorProjects,
  getAllProjects,
  debugProjects,
  createTestProject,
  cleanupInvalidData,
  updateProjectProgress,
  getProjectProgress
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (for exploration)
router.get('/explore', getAllProjects);

// Debug route
router.get('/debug', debugProjects);

// Cleanup route (admin only)
router.get('/cleanup', cleanupInvalidData);

// Test route
router.post('/test', createTestProject);

// Student routes
router.post('/', createProject);
router.get('/my-projects', getStudentProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.put('/:id/progress', updateProjectProgress);
router.get('/:id/progress', getProjectProgress);
router.delete('/:id', deleteProject);

// Mentor routes
router.get('/mentor-projects', getMentorProjects);

export default router;