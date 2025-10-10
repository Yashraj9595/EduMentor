import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, adminOnly } from '../middleware/auth';
import { validateUserQuery, validateUserId } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public mentor routes
router.get('/mentors', UserController.getMentors);

// Route for users to get their own profile (accessible by all authenticated users)
router.get('/me', UserController.getUserById as any);

// Admin only routes
router.get('/', adminOnly, validateUserQuery, UserController.getAllUsers as any);
router.get('/stats', adminOnly, UserController.getUserStats as any);
router.get('/search', adminOnly, UserController.searchUsers as any);
router.get('/:id', adminOnly, validateUserId, UserController.getUserById as any);
router.put('/:id', adminOnly, validateUserId, UserController.updateUser as any);
router.delete('/:id', adminOnly, validateUserId, UserController.deleteUser as any);
router.patch('/:id/deactivate', adminOnly, validateUserId, UserController.deactivateUser as any);
router.patch('/:id/activate', adminOnly, validateUserId, UserController.activateUser as any);

export default router;