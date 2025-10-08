import { Router } from 'express';
import { 
  MentorNetworkingController 
} from '../controllers/mentorNetworkingController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Connection routes
router.post('/connections/request', MentorNetworkingController.sendConnectionRequest);
router.get('/connections/requests', MentorNetworkingController.getConnectionRequests);
router.put('/connections/:connectionId/accept', MentorNetworkingController.acceptConnectionRequest);
router.put('/connections/:connectionId/reject', MentorNetworkingController.rejectConnectionRequest);
router.get('/connections', MentorNetworkingController.getConnectedMentors);

// Group routes
router.post('/groups', MentorNetworkingController.createGroup);
router.get('/groups', MentorNetworkingController.getGroups);
router.get('/groups/:id', MentorNetworkingController.getGroupById);
router.post('/groups/:id/join', MentorNetworkingController.joinGroup);

// Discussion routes
router.post('/discussions', MentorNetworkingController.createDiscussion);
router.get('/discussions', MentorNetworkingController.getDiscussions);
router.post('/discussions/:id/like', MentorNetworkingController.likeDiscussion);

export default router;