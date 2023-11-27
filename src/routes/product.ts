import { Router } from 'express';
import product from '../controllers/product';
import validate from '../middlewares/validate';
import validator from '../validator/product'

// Create an Express Router
const routes = Router();

// Route for creating user product
routes.post(
    "/create-product",
    validate(validator.createProduct),
    product.createProduct
);

// Route for getting all products
routes.get(
    "/get-all-products",
    product.getAllProducts
);

// Route for getting product by id
routes.get(
    "/get-product-by-id",
    product.getProduct
);

// Route for updating product
routes.put(
    "/update-product",
    validate(validator.updateProduct),
    product.updateProduct
);

// Route for deleting single product
routes.delete(
    "/delete-product",
    validate(validator.deleteProduct),
    product.deleteProduct
);

// Route for deleting multiple products
routes.delete(
    "/delete-multiple-products",
    product.deleteMultipleProduct
);

export default routes;