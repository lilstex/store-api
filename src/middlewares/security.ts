import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import customResponse from '../helpers/response';

// Extend the Request type to include the 'auth' property
interface AuthenticatedRequest extends Request {
    auth?: any;
}

// Define a list of non-restricted paths
const nonRestricted: string[] = [
    "/api/create-user",
    "/api/login"
];

// Middleware function to handle authentication and authorization
const middleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    // Check if the requested path is in the list of non-restricted paths
    if (nonRestricted.includes(req.path)) {
        // If it's a non-restricted path, proceed to the next middleware
        next();
    } else {
        // Verify the token for restricted paths
        let token: string | undefined;

        // Check if the request has an 'Authorization' header
        if (req.headers.authorization) {
            // Parse the 'Authorization' header
            const [authType, authToken] = req.headers.authorization.split(' ');

            // Check the authorization type ('Bearer' in this case)
            if (authType.toLowerCase() === 'bearer') {
                token = authToken;
            } else {
                // If not 'Bearer', consider the entire header as the token
                token = req.headers.authorization;
            }

            // Verify the token using the JWT library
            jwt.verify(token, process.env.JWT_KEY as string, (err: jwt.JsonWebTokenError | null, user: any) => {
                if (err) {
                    // If token verification fails, respond with a forbidden error
                    return customResponse.forbiddenResponse('Token is invalid or has expired!', res);
                }
                // If the token is valid, attach the user information to the request as 'auth'
                req.auth = user;
                // Proceed to the next middleware
                next();
            });
        } else {
            // If no 'Authorization' header is present, respond with an unauthorized error
            return customResponse.unAuthorizedResponse('You are not authorized!', res);
        }
    }
};

export { middleware, AuthenticatedRequest };