import { Router } from 'express';
import { 
  MentorAnalyticsController 
} from '../controllers/mentorAnalyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Mentor analytics routes
router.get('/dashboard', MentorAnalyticsController.getMentorAnalytics);
router.get('/student-progress', MentorAnalyticsController.getStudentProgress);
router.get('/effectiveness', MentorAnalyticsController.getMentoringEffectiveness);

export default router;