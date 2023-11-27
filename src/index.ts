import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { middleware } from './middlewares/security';
import customResponse from './helpers/response';
import routes from './routes';
import swagger from './config/swagger';
// Load environment variables from a .env file
dotenv.config();
// Create an Express application
const app: Express = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON bodies in requests
app.use(bodyParser.json());
app.use(express.json());

// Serve Swagger documentation at /api-docs using swagger-ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// Middleware for security measures
app.use(middleware);

// Use the defined routes for handling API requests
app.use('/api', routes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // Handle internal server errors and send a custom response
    return customResponse.serverErrorResponse("Internal server error", res, err);
});

export default app;