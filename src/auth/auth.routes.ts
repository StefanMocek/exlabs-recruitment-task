import {Router} from 'express';
import AuthController from './auth.controller';
import {currentUser} from '../utils/middlewares/current-user';
import {emailAndPwdValidation} from './validators/email-password-validator';
import {validateRequest} from '../utils/middlewares/validate-request';

const router = Router();

router.post('/register',
  emailAndPwdValidation,
  validateRequest,
  AuthController.register);

router.post('/login',
  emailAndPwdValidation,
  validateRequest, 
  AuthController.login);

router.get('/current-user', currentUser(process.env.JWT_KEY!), AuthController.getCurrentUser);
router.get('/logout', currentUser(process.env.JWT_KEY!), AuthController.logout);

export {router as authRouter};
