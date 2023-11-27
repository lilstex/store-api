import mongoose, { Document, Schema } from 'mongoose';

interface User extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, select: false },
});

const User = mongoose.model<User>('User', userSchema);

export default User;