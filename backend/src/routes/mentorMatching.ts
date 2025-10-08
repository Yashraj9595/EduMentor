import { Router } from 'express';
import { 
  MentorMatchingController 
} from '../controllers/mentorMatchingController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Mentor preference routes
router.post('/mentor/preferences', MentorMatchingController.setMentorPreferences);
router.get('/mentor/preferences', MentorMatchingController.getMentorPreferences);

// Student preference routes
router.post('/student/preferences', MentorMatchingController.setStudentPreferences);
router.get('/student/preferences', MentorMatchingController.getStudentPreferences);

// Matching routes
router.get('/matches', MentorMatchingController.findMatchingMentors);
router.post('/matches/request', MentorMatchingController.requestMentorMatch);

// Mentor match management routes
router.get('/matches/requests', MentorMatchingController.getMentorMatchRequests);
router.put('/matches/:matchId/accept', MentorMatchingController.acceptMatchRequest);
router.put('/matches/:matchId/reject', MentorMatchingController.rejectMatchRequest);

export default router;