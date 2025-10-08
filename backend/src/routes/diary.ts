import { Router } from 'express';
import { 
  createDiaryEntry,
  getDiaryEntries,
  getDiaryEntry,
  updateDiaryEntry,
  createReview,
  getReviews,
  updateReview,
  createMilestone,
  getMilestones,
  updateMilestone,
  getProjectProgress,
  getProjectProgressTimeline,
  updateProjectProgressTimeline,
  getMentorDashboard
} from '../controllers/diaryController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Diary Entry Routes
router.post('/entries', createDiaryEntry);
router.get('/entries/:projectId', getDiaryEntries);
router.get('/entry/:entryId', getDiaryEntry);
router.put('/entry/:entryId', updateDiaryEntry);

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
router.get('/progress-timeline/:projectId', getProjectProgressTimeline);
router.put('/progress-timeline/:projectId', updateProjectProgressTimeline);

// Mentor Dashboard
router.get('/mentor-dashboard', getMentorDashboard);

export default router;