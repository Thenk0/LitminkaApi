import { Router } from 'express';
import FollowController from '../controllers/FollowController';
import { auth } from '../middleware/auth';
import { FollowValidation, UnFollowValidation } from '../validators/FollowValidator';
import { wrap } from '../middleware/errorHandler';
const router = Router();

router.post("/:anime_id", [auth, ...FollowValidation()], wrap(FollowController.follow));
router.delete("/:anime_id", [auth, ...UnFollowValidation()], wrap(FollowController.unfollow));
export { router as followRouter };