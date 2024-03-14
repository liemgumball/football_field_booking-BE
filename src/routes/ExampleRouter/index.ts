import Paths from '@src/constants/Paths';
import { Router } from 'express';
import UserERoutes from './UserERoutes';
import jetValidator from 'jet-validator/lib/jet-validator';
import UserE from '@src/models/UserExample';

const userERouter = Router();
const validate = jetValidator();

// Get all users
userERouter.get(Paths.Users.Get, UserERoutes.getAll);

// Add one user
userERouter.post(
  Paths.Users.Add,
  validate(['user', UserE.isUserE]),
  UserERoutes.add,
);

// Update one user
userERouter.put(
  Paths.Users.Update,
  validate(['user', UserE.isUserE]),
  UserERoutes.update,
);

// Delete one user
userERouter.delete(
  Paths.Users.Delete,
  validate(['id', 'number', 'params']),
  UserERoutes.delete,
);

export default userERouter;
