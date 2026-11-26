import { Router } from 'express';
import {
  createUser, getUserById, editUser, deleteUser, getUsersByUsername,
} from '../controllers/user-controller.js';
import validate from '../../../middlewares/validate.js';
import authenticateToken from '../../../middlewares/auth.js';
import { userPayloadSchema, userUpdatePayloadSchema } from '../validator/schema.js';

const router = Router();

// Public route - Register user
router.post('/', validate(userPayloadSchema), createUser);
router.get('/:id', getUserById);
router.get('/', getUsersByUsername);

// Protected routes - Require authentication
router.put('/:id', authenticateToken, validate(userUpdatePayloadSchema), editUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
