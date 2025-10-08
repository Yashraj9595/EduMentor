import express from 'express';
import {
  registerForHackathon,
  getUserRegistrations,
  cancelRegistration,
  getHackathonParticipants
} from '../controllers/hackathonRegistrationController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Register for a hackathon
router.post('/:hackathonId/register', authenticate, registerForHackathon);

// Get user's registrations
router.get('/my-registrations', authenticate, getUserRegistrations);

// Cancel registration
router.delete('/:hackathonId/register', authenticate, cancelRegistration);

// Get hackathon participants (for organizers)
router.get('/:hackathonId/participants', getHackathonParticipants);

export default router;
