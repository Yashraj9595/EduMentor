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
router.get('/me', UserController.getUserById);

// Admin only routes
router.get('/', adminOnly, validateUserQuery, UserController.getAllUsers);
router.get('/stats', adminOnly, UserController.getUserStats);
router.get('/search', adminOnly, UserController.searchUsers);
router.get('/:id', adminOnly, validateUserId, UserController.getUserById);
router.put('/:id', adminOnly, validateUserId, UserController.updateUser);
router.delete('/:id', adminOnly, validateUserId, UserController.deleteUser);
router.patch('/:id/deactivate', adminOnly, validateUserId, UserController.deactivateUser);
router.patch('/:id/activate', adminOnly, validateUserId, UserController.activateUser);

export default router;