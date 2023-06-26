import { Router } from 'express';
import { requireAuth } from '../utils/middlewares';
import { usersController } from './users.controller';
import { validateRequest } from '../utils/middlewares';
import { createUserValidation, idParamValidation, roleQueryValidation, updateUserValidation } from './validators';

const router = Router();

router.route('/user').post(createUserValidation, validateRequest, requireAuth, usersController.addUser);

router.route('/users').get(roleQueryValidation, validateRequest, requireAuth, usersController.getAllUsers);

router
  .route('/user/:id')
  .get(idParamValidation, validateRequest, requireAuth, usersController.getSingleUser)
  .patch(idParamValidation, updateUserValidation, validateRequest, requireAuth, usersController.updateUser)
  .delete(idParamValidation, validateRequest, requireAuth, usersController.deleteUser);

export { router as usersRouter };
