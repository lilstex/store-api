import Joi from 'joi';

// Define and export validation schemas using Joi
interface CreateUserSchema {
  email: string;
  username: string;
  password: string;
}

interface LoginSchema {
  email: string;
  password: string;
}

interface updateUsernameSchema {
  username: string;
}


const validationSchemas = {
  // Schema for creating a user
  createUser: Joi.object<CreateUserSchema>({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),

  // Schema for user login
  login: Joi.object<LoginSchema>({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),

  // Schema for get user
  updateUsername: Joi.object<updateUsernameSchema>({
    username: Joi.string().required(),
  }),
};

export default validationSchemas;
