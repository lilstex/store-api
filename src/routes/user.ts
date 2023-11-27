import { Router } from 'express';
import user from '../controllers/user';
import validate from '../middlewares/validate';
import validator from '../validator/user';

// Create an Express Router
const routes = Router();

// Route for creating a user account
routes.post(
    "/create-user",
    validate(validator.createUser),
    user.createUser
);

// Route for user login
routes.post(
    "/login",
    validate(validator.login),
    user.login
);

// Route for getting user details
routes.get(
    "/get-user",
    user.getUser
);

// Route for getting all users
routes.get(
    "/get-all-users",
    user.getAllUsers
);

// Route for getting all users
routes.patch(
    "/update-username",
    validate(validator.updateUsername),
    user.updateUsername
);

// Route for deleting user account
routes.delete(
    "/delete-user",
    user.deleteUser
);

export default routes;