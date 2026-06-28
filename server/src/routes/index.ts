import { Router } from 'express';
import authRoutes from './authRoutes';
import resourceRoutes from './resourceRoutes';
import bookmarkRoutes from './bookmarkRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/resources', resourceRoutes);
router.use('/bookmarks', bookmarkRoutes);

export default router;
