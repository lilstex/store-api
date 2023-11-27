import mongoose from 'mongoose';
import http from 'http';
import app from './index';

// Define the port for the server to listen on
const PORT: number = parseInt(process.env.PORT || '5000', 10);

// MongoDB connection URL
const MONGODB_URI: string = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/mainstack-store';

// Create an HTTP server using Express
const server: http.Server = http.createServer(app);

// Start the server and connect to the MongoDB database
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/api-docs`);

    // Connect to MongoDB
    mongoose.connect(MONGODB_URI);

    // Event handler for successful MongoDB connection
    mongoose.connection.on('connected', () => {
        console.log('Database connected successfully');
    });
});


