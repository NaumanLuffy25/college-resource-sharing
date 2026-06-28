import { Router } from 'express';
import { addBookmark, removeBookmark, getBookmarks, getLeaderboard } from '../controllers/bookmarkController';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getBookmarks);
router.post('/', protect, addBookmark);
router.delete('/:resourceId', protect, removeBookmark);
router.get('/leaderboard', protect, getLeaderboard);

export default router;
