import { Router } from 'express';
import { InstitutionController } from '../controllers/institutionController';
import { authenticate, institutionAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validateUserId } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use((req, res, next) => {
  console.log('Institution route accessed:', req.method, req.path);
  next();
});
router.use(authenticate);

// Admin and Institution admin routes
router.post('/accounts', institutionAdmin, InstitutionController.createAccount);
router.post('/accounts/bulk', institutionAdmin, upload.single('file'), InstitutionController.createBulkAccounts);
router.get('/accounts', institutionAdmin, InstitutionController.getInstitutionAccounts);
router.get('/accounts/stats', institutionAdmin, InstitutionController.getAccountStats);
router.get('/template', institutionAdmin, InstitutionController.downloadTemplate);
router.put('/accounts/:id', institutionAdmin, validateUserId, InstitutionController.updateAccount);
router.delete('/accounts/:id', institutionAdmin, validateUserId, InstitutionController.deleteAccount);
router.patch('/accounts/:id/activate', institutionAdmin, validateUserId, InstitutionController.activateAccount);
router.patch('/accounts/:id/deactivate', institutionAdmin, validateUserId, InstitutionController.deactivateAccount);

export default router;