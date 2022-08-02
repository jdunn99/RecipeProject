import { Router } from 'express';
import { isAuthenticated } from '../middleware/passport.middleware';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.get);
router.get('/me', isAuthenticated, userController.getUser);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

export default router;
