import {Router} from 'express';
import AuthController from './auth.controller';
import {currentUser} from '../utils/middlewares/current-user';

const router = Router();

//to do
//validate body 
router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.get('/current-user', currentUser(process.env.JWT_KEY!), AuthController.getCurrentUser);
router.get('/logout', currentUser(process.env.JWT_KEY!), AuthController.logout);

export {router as authRouters};
