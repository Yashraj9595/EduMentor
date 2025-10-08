import express from 'express';
import {
  submitProject,
  getUserSubmissions,
  updateSubmission,
  deleteSubmission,
  getHackathonSubmissions,
  getSubmissionDetails
} from '../controllers/hackathonSubmissionController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Submit project for hackathon
router.post('/:hackathonId/submit', authenticate, submitProject);

// Get user's submissions
router.get('/my-submissions', authenticate, getUserSubmissions);

// Update submission
router.put('/:hackathonId/submissions/:submissionId', authenticate, updateSubmission);

// Delete submission
router.delete('/:hackathonId/submissions/:submissionId', authenticate, deleteSubmission);

// Get hackathon submissions (for organizers)
router.get('/:hackathonId/submissions', getHackathonSubmissions);

// Get submission details
router.get('/:hackathonId/submissions/:submissionId', getSubmissionDetails);

export default router;
