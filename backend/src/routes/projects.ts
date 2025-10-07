import { Router } from 'express';
import { 
  createProject,
  getStudentProjects,
  getProjectById,
  updateProject,
  deleteProject,
  getMentorProjects
} from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Student routes
router.post('/', createProject);
router.get('/my-projects', getStudentProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

// Mentor routes
router.get('/mentor-projects', getMentorProjects);

export default router;