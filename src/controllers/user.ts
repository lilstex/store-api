import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import customResponse from '../helpers/response';
import User from '../models/user';
import Product from '../models/product';
import { AuthenticatedRequest } from '../middlewares/security';
// Load environment variables from a .env file
import dotenv from 'dotenv';
dotenv.config();

const JWT_KEY: string = process.env.JWT_KEY!;
const TOKEN_VALIDATION_DURATION: string = process.env.TOKEN_VALIDATION_DURATION!;

/**
 * Create a new user.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, username } = req.body;
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return customResponse.badRequestResponse('Email already in use', res);
        }
        // Check if username is already in use
        const lowerCaseUsername = username.toLowerCase();
        const existingUsername = await User.findOne({ username: lowerCaseUsername });
        if (existingUsername) {
            return customResponse.badRequestResponse('Username already in use', res);
        }
        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 12);
        // Create new user
        const user = await User.create({
            email,
            username: lowerCaseUsername,
            password: hashedPassword,
        });
        // Serialize user data to return
        const newUser = {
            id: user._id,
            email: user.email,
            username: user.username,
        };

        return customResponse.createResponse('User created successfully', newUser, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the create user endpoint',
            res,
            err
        );
    }
};

/**
 * Handle user login.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with success or error message
 */
const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = await User.findOne({ email }).select('+password') ;
        if (!user) {
            return customResponse.badRequestResponse('Incorrect credentials', res);
        }
        // Check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return customResponse.badRequestResponse('Incorrect credentials', res);
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, JWT_KEY, {
            expiresIn: TOKEN_VALIDATION_DURATION,
        });

        // Serialize user data
        const userData = {
            token,
            id: user._id,
            email: user.email,
            username: user.username
        };

        return customResponse.successResponse('Login successful', userData, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the login endpoint',
            res,
            err
        );
    }
};

/**
 * Get user information.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with user information or error message
 */
const getUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure userId from query parameters
        const { userId } = req.query;
        // Check if userId is undefined
        if (!userId) {
            return customResponse.badRequestResponse('User ID is required', res);
        }
        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return customResponse.badRequestResponse('User not found', res);
        }
        // Return srialized user information
        return customResponse.successResponse('User fetched successfully', user, res);
    } catch (err: any) {
        console.error(err);
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the get user endpoint',
            res,
            err
        );
    }
};


/**
 * Get all users.
 * @param req - Express Request object
 * @param res - Express Response object
 * @returns Response with all users or error message
 */
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // Explicitly cast query parameters to numbers and handle undefined
        const page = req.query.page ? Number(req.query.page) : undefined;
        const documentCount = req.query.documentCount ? Number(req.query.documentCount) : undefined;

        // Check if page or documentCount is undefined before using them
        if (page === undefined || documentCount === undefined) {
            return customResponse.badRequestResponse('Invalid page or documentCount', res);
        }
        // Get the total count of registered users
        const totalUsers = await User.countDocuments();

        // Fetch all users from the database
        const allUsers = await User.find()
            .limit(documentCount)
            .skip(documentCount * (page - 1))
            .sort({ createdAt: -1 });

        // Calculate prevPage and nextPage
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = documentCount * page < totalUsers ? page + 1 : null;

        // Prepare data to send in the response
        const data = {
            page,
            prevPage,
            nextPage,
            documentCount,
            totalUsers,
            allUsers,
        };
        // Return success response with the list of users
        return customResponse.successResponse('Users fetched successfully', data, res);
    } catch (err: any) {
        console.error(err);

        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the get all users endpoint',
            res,
            err
        );
    }
};

/**
 * Update the username of the authenticated user.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with the updated user information or error message
 */
const updateUsername = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure username from request body and id from auth
        const { username } = req.body;
        const { userId } = req.auth;

        // Find user by ID
        const user = await User.findById(userId);

        // Check if the user is not found
        if (!user) {
            return customResponse.badRequestResponse('User not found', res);
        }
        // Check if username is already in use
        const lowerCaseUsername = username.toLowerCase();
        const existingUsername = await User.findOne({ username: lowerCaseUsername });
        if (existingUsername) {
            return customResponse.badRequestResponse('Username already in use', res);
        }

        // Update username and save changes
        user.username = lowerCaseUsername;
        await user.save();

        // Return success response with updated user information
        return customResponse.successResponse('Username updated successfully', user, res);
    } catch (err: any) {
        console.error(err);
        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the update username endpoint',
            res,
            err
        );
    }
};

/**
 * Delete the authenticated user and associated products.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with information about the deleted user and products or error message
 */
const deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure id from auth
        const { userId } = req.auth;

        // Delete associated products before deleting the user
        await Product.deleteMany({ user: userId });

        // Delete the user
        const deletedUser = await User.findOneAndDelete({ _id: userId });

        // Return success response with information about the deleted user
        return customResponse.successResponse('User deleted successfully', deletedUser, res);
    } catch (err: any) {
        console.error(err);

        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in delete endpoint',
            res,
            err
        );
    }
};

export default {
    createUser,
    login,
    getUser,
    getAllUsers,
    updateUsername,
    deleteUser
};
