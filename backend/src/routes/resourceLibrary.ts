import { Router } from 'express';
import { 
  ResourceLibraryController 
} from '../controllers/resourceLibraryController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public resource routes
router.get('/', ResourceLibraryController.getResources);
router.get('/popular', ResourceLibraryController.getPopularResources);
router.get('/featured', ResourceLibraryController.getFeaturedResources);
router.get('/:id', ResourceLibraryController.getResourceById);
router.get('/:id/ratings', ResourceLibraryController.getResourceRatings);

// Authenticated user routes
router.post('/', ResourceLibraryController.uploadResource);
router.get('/my-resources', ResourceLibraryController.getMyResources);
router.put('/:id', ResourceLibraryController.updateResource);
router.delete('/:id', ResourceLibraryController.deleteResource);
router.post('/:id/rate', ResourceLibraryController.rateResource);
router.post('/:id/download', ResourceLibraryController.downloadResource);

export default router;