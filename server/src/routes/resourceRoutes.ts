import { Router } from 'express';
import {
  uploadResource, getResources, getResourceById, updateResource, deleteResource,
  downloadResource, addReview, getMyResources, getRecommendations, getSimilarResources,
  getTrending, getDashboardStats, approveResource, getPendingResources, getAdminStats,
} from '../controllers/resourceController';
import { protect, authorize } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { apiLimiter, uploadLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/recommendations', protect, getRecommendations);
router.get('/trending', protect, getTrending);
router.get('/my-resources', protect, getMyResources);
router.get('/pending', protect, authorize('admin', 'moderator'), getPendingResources);
router.get('/admin/stats', protect, authorize('admin'), getAdminStats);

router.post('/', protect, uploadLimiter, upload.single('file'), uploadResource);
router.get('/', apiLimiter, getResources);
router.get('/:id', apiLimiter, getResourceById);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.get('/:id/download', protect, downloadResource);
router.post('/:id/reviews', protect, addReview);
router.get('/:id/similar', protect, getSimilarResources);
router.put('/:id/approve', protect, authorize('admin', 'moderator'), approveResource);

export default router;
