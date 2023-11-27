import { Request, Response } from 'express';
import customResponse from '../helpers/response';
import Product from '../models/product';
import { AuthenticatedRequest } from '../middlewares/security';

/**
 * Create a new product.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with created product information or error message
 */
const createProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { name, ...productData } = req.body;
        const { userId } = req.auth;

        // Convert the name to lowercase
        const lowercaseName = name.toLowerCase();

        // Check if a product with the same lowercase name already exists for the user
        const existingProduct = await Product.findOne({ user: userId, name: lowercaseName });
        if (existingProduct) {
            return customResponse.badRequestResponse('Product with the same name already exists', res);
        }

        // Create a new product with the user ID and provided data
        const newProduct = await Product.create({
            user: userId,
            name: lowercaseName,
            ...productData,
        });

        // Check if product creation was successful
        if (!newProduct) {
            return customResponse.badRequestResponse('Failed to create product', res);
        }

        // Return success response with created product information
        return customResponse.createResponse('Product created successfully', newProduct, res);
    } catch (err: any) {
        console.error(err);
        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in the product creation endpoint',
            res,
            err
        );
    }
};

/**
 * Get all products with pagination.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with paginated product information or error message
 */
const getAllProducts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Explicitly cast query parameters to numbers and handle undefined
        const page = req.query.page ? Number(req.query.page) : undefined;
        const documentCount = req.query.documentCount ? Number(req.query.documentCount) : undefined;

        // Check if page or documentCount is undefined before using them
        if (page === undefined || documentCount === undefined) {
            return customResponse.badRequestResponse('Invalid page or documentCount', res);
        }

        // Get the total count of products
        const totalProducts = await Product.countDocuments();

        // Retrieve paginated products
        const allProducts = await Product.find()
            .populate({path: "user"})
            .limit(documentCount)
            .skip(documentCount * (page - 1))
            .sort({ createdAt: -1 });

        // Calculate prevPage and nextPage
        const prevPage = page > 1 ? page - 1 : null;
        const nextPage = documentCount * page < totalProducts ? page + 1 : null;

        // Prepare data to send in the response
        const data = {
            page,
            prevPage,
            nextPage,
            documentCount,
            totalProducts,
            allProducts,
        };

        // Return success response with paginated product information
        return customResponse.successResponse('Get all products successful', data, res);
    } catch (err: any) {
        console.error(err);
        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in getAllProducts endpoint',
            res,
            err
        );
    }
};

/**
 * Get a specific product by ID.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with the product information or error message
 */
const getProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure productId from query parameters
        const { productId } = req.query;

        // Check if productId is undefined
        if (!productId) {
            return customResponse.badRequestResponse('Product ID is required', res);
        }

        // Find the product by ID
        const product = await Product.findOne({ _id: productId }).populate({path: "user"});

        // Check if the product was not found
        if (!product) {
            return customResponse.badRequestResponse('Product not found', res);
        }

        // Return success response with product information
        return customResponse.successResponse('Product gotten successfully', product, res);
    } catch (err: any) {
        console.error(err);

        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in get product endpoint',
            res,
            err
        );
    }
};

/**
 * Update a specific product by ID.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with the updated product information or error message
 */
const updateProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure productId, name, quantity, unitPrice, and description from request body
        const { productId, name, quantity, unitPrice, description } = req.body;
        const { userId } = req.auth;

        // Check if any required parameter is undefined
        if (!name || !productId || !quantity || !unitPrice || !description) {
            return customResponse.badRequestResponse('Missing product parameter', res);
        }

        // Convert the name to lowercase
        const lowercaseName = name.toLowerCase();

        // Find the product to check if it belongs to the authenticated user
        const existingProduct = await Product.findOne({ _id: productId });

        // Check if the product exist
        if (!existingProduct) {
            return customResponse.badRequestResponse('Product not found', res);
        }
        // Check if product belongs to the user
        if(existingProduct.user.toString() !== userId) {
            return customResponse.badRequestResponse('Product does not belong to the user', res);
        }

        // Create an object with the updated values
        const newUpdate = {
            name: lowercaseName,
            quantity,
            unitPrice,
            description,
        };

        // Find and update the product by ID
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, user: userId },
            newUpdate,
            {
                new: true,
                runValidators: true,
            }
        );

        // Return success response with updated product information
        return customResponse.successResponse('Update product successful', updatedProduct, res);
    } catch (err: any) {
        console.error(err);

        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in update product endpoint',
            res,
            err
        );
    }
};

/**
 * Delete a specific product by ID.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with the deleted product information or error message
 */
const deleteProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure productId from request body
        const { productId } = req.body;
        const { userId } = req.auth;

        // Find the product to check if it belongs to the authenticated user
        const existingProduct = await Product.findOne({ _id: productId});

        // Check if the product exists
        if (!existingProduct) {
            return customResponse.badRequestResponse('Product not found', res);
        }
        // Check if product belongs to the user
        if(existingProduct.user.toString() !== userId) {
            return customResponse.badRequestResponse('Product does not belong to the user', res);
        }

        // Find and delete the product by ID
        const deletedProduct = await Product.findOneAndDelete({ _id: productId });

        // Return success response with deleted product information
        return customResponse.successResponse('Delete product successful', deletedProduct, res);
    } catch (err: any) {
        console.error(err);
        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in delete product endpoint',
            res,
            err
        );
    }
};

/**
 * Delete multiple products by their IDs.
 * @param req - Express Request object with authenticated user information
 * @param res - Express Response object
 * @returns Response with information about the deleted products or error message
 */
const deleteMultipleProduct = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Destructure arrayOfProductIds from request body
        const { arrayOfProductIds } = req.body;
        const { userId } = req.auth;

        // Check if products exist
        const products = await Product.find({ _id: { $in: arrayOfProductIds }, user: userId});

        // Check if any of the products do not belong to the authenticated user
        if (products.length === 0) {
            return customResponse.badRequestResponse("Products do not belong to the user", res);
        }

        // Delete the multiple products
        const deletedProducts = await Product.deleteMany({ _id: { $in: arrayOfProductIds }, user: userId});

        // Return success response with information about the deleted products
        return customResponse.successResponse(
            `Successfully deleted ${deletedProducts.deletedCount} products that belong to the user`,
            deletedProducts,
            res
        );
    } catch (err: any) {
        console.error(err);
        // Return server error response if an error occurs
        return customResponse.serverErrorResponse(
            'Oops... Something occurred in delete multiple products endpoint',
            res,
            err
        );
    }
};

export default {
    createProduct,
    getAllProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    deleteMultipleProduct
};
