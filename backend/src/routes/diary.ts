import express from 'express';
import { 
  createDiaryEntry,
  getDiaryEntries,
  updateDiaryEntry,
  createReview,
  getReviews,
  updateReview,
  createMilestone,
  getMilestones,
  updateMilestone,
  getProjectProgress,
  getMentorDashboard
} from '../controllers/diaryController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Diary Entry Routes
router.post('/entries', createDiaryEntry);
router.get('/entries/:projectId', getDiaryEntries);
router.put('/entries/:entryId', updateDiaryEntry);

// Review Routes
router.post('/reviews', createReview);
router.get('/reviews/:projectId', getReviews);
router.put('/reviews/:reviewId', updateReview);

// Milestone Routes
router.post('/milestones', createMilestone);
router.get('/milestones/:projectId', getMilestones);
router.put('/milestones/:milestoneId', updateMilestone);

// Progress Routes
router.get('/progress/:projectId', getProjectProgress);

// Dashboard Routes
router.get('/mentor/dashboard', getMentorDashboard);

export default router;
