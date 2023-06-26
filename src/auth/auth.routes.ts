import { Router } from 'express';
import { authController } from './auth.controller';
import { currentUser } from '../utils/middlewares/current-user';
import { emailAndPwdValidation } from './validators/email-password-validator';
import { validateRequest } from '../utils/middlewares/validate-request';

const router = Router();

router.post('/register', emailAndPwdValidation, validateRequest, authController.register);

router.post('/login', emailAndPwdValidation, validateRequest, authController.login);

router.get('/current-user', currentUser(process.env.JWT_KEY!), authController.getCurrentUser);
router.get('/logout', currentUser(process.env.JWT_KEY!), authController.logout);

export { router as authRouter };
