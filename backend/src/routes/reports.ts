import express from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middleware/auth';

const router = express.Router();
const reportController = new ReportController();

// Generate report
router.post('/generate', authenticate, reportController.generateReport);

// Get templates
router.get('/templates', reportController.getTemplates);

// Get template by ID
router.get('/templates/:templateId', reportController.getTemplate);

// Save draft
router.post('/drafts', authenticate, reportController.saveDraft);

// Load draft
router.get('/drafts/:draftId', authenticate, reportController.loadDraft);

// Get user drafts
router.get('/drafts/user/:userId', authenticate, reportController.getUserDrafts);

// Delete draft
router.delete('/drafts/:draftId', authenticate, reportController.deleteDraft);

// Validate report
router.post('/validate', reportController.validateReport);

// Get report stats
router.post('/stats', reportController.getReportStats);

export default router;
