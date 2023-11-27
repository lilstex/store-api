import Joi from 'joi';

// Define and export validation schemas using Joi
interface CreateProductSchema {
    name: string;
    quantity: number;
    unitPrice: number;
    description: string;
}

interface UpdateProductSchema {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    description: string;
}

interface DeleteProductSchema {
    productId: string;
}

interface DeleteMultipleProductSchema {
    arrayOfProductIds: string[];
}


const validationSchemas = {
  // Schema for creating a product
  createProduct: Joi.object<CreateProductSchema>({
    name: Joi.string().required(),
    quantity: Joi.number().required(),
    unitPrice: Joi.number().required(),
    description: Joi.string().required(),
  }),

  // Schema for product update
    updateProduct: Joi.object<UpdateProductSchema>({
        productId: Joi.string().required(),
        name: Joi.string().required(),
        quantity: Joi.number().required(),
        unitPrice: Joi.number().required(),
        description: Joi.string().required(),
    }),

    // Schema for deleting product by id
    deleteProduct: Joi.object<DeleteProductSchema>({
        productId: Joi.string().required(),
    }),

    // Schema for deleting multiple products
    deleteMultipleProduct: Joi.object<DeleteMultipleProductSchema>({
        arrayOfProductIds: Joi.array().required(),
    }),
};

export default validationSchemas;
