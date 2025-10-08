import { Router } from 'express';
import { 
  createProblemStatement,
  getMentorProblemStatements,
  getActiveProblemStatements,
  getProblemStatementById,
  updateProblemStatement,
  deleteProblemStatement,
  toggleProblemStatementActive
} from '../controllers/problemStatementController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public routes (for students to browse)
router.get('/active', getActiveProblemStatements);

// Mentor routes
router.post('/', createProblemStatement);
router.get('/mentor', getMentorProblemStatements);
router.get('/:id', getProblemStatementById);
router.put('/:id', updateProblemStatement);
router.delete('/:id', deleteProblemStatement);
router.put('/:id/toggle-active', toggleProblemStatementActive);

export default router;