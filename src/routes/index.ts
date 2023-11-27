import { Router, Request, Response, NextFunction } from 'express';
import userRoutes from './user';
import productRoutes from './product';

import customResponse from '../helpers/response';

// Create an Express Router
const routes = Router();

// Use the userRoutes for the root path ("/")
routes.use("", userRoutes);

// Use the productRoutes for the "/product" path
routes.use("/product", productRoutes);

// Handle requests for unknown routes
routes.use((_, res: Response) => {
    customResponse.notFoundResponse('Route not found', res);
});

export default routes;