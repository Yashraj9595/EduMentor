import { Router } from 'express';
import { 
  SchedulingController 
} from '../controllers/schedulingController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Availability routes
router.post('/availability', SchedulingController.setAvailability);
router.get('/availability', SchedulingController.getAvailability);
router.get('/availability/:mentorId', SchedulingController.getMentorAvailability);
router.get('/availability/slots', SchedulingController.getAvailableTimeSlots);

// Meeting routes
router.post('/meetings', SchedulingController.scheduleMeeting);
router.get('/meetings', SchedulingController.getMyMeetings);
router.get('/meetings/:id', SchedulingController.getMeetingById);
router.put('/meetings/:id', SchedulingController.updateMeeting);
router.delete('/meetings/:id', SchedulingController.cancelMeeting);

export default router;