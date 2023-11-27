import mongoose, { Document, Schema } from 'mongoose';
import User from './user';

interface Product extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    unitPrice: number; 
    description: string;
}

const productSchema = new Schema<Product>({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: User },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    description: { type: String, required: true },
});

const Product = mongoose.model<Product>('Product', productSchema);

export default Product;
