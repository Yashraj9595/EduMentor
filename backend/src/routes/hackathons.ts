import express from 'express';
import {
  createHackathon,
  getAllHackathons,
  getHackathonById,
  updateHackathon,
  deleteHackathon,
  publishHackathon,
  getHackathonsByOrganizer,
  getHackathonStats
} from '../controllers/hackathonController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Create a new hackathon
router.post('/', authenticate, createHackathon);

// Get all hackathons
router.get('/', getAllHackathons);

// Get hackathon by ID
router.get('/:id', getHackathonById);

// Update hackathon
router.put('/:id', authenticate, updateHackathon);

// Delete hackathon
router.delete('/:id', authenticate, deleteHackathon);

// Publish hackathon
router.patch('/:id/publish', authenticate, publishHackathon);

// Get hackathons by organizer
router.get('/organizer/:organizerId', getHackathonsByOrganizer);

// Get hackathon statistics
router.get('/:id/stats', authenticate, getHackathonStats);

export default router;
