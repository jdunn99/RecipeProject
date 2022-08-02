import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.get);
router.post('/login', userController.login);
router.post('/register', userController.register);

export default router;
