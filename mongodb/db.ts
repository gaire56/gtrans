//Gaire Ananta Prasad M24W0272

import mongoose from "mongoose";

// Retrieve MongoDB credentials from environment variables
const dbUsername = process.env.MONGO_DB_USERNAME; // MongoDB admin username
const dbPassword = process.env.MONGO_DB_PASSWORD; // MongoDB admin password

// Construct MongoDB connection string using MongoDB Atlas
const connectionString = `mongodb+srv://${dbUsername}:${dbPassword}@google-translate-web-project-kcgi.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

// Ensure that credentials are defined in environment variables
if (!dbUsername || !dbPassword) {
    throw new Error("Please define the MONGO_DB_USERNAME and MONGO_DB_PASSWORD environment variables inside .env.local");
}

// Function to connect to MongoDB
const connectDB = async () => {
    // Check if there is already a connection to MongoDB
    if (mongoose.connection?.readyState >= 1) {
        console.log("-----Already Connected to MongoDB-----");
        return;
    }

    try {
        // Attempt to connect to MongoDB using the provided connection string
        await mongoose.connect(connectionString);
        console.log("-----Connected to MongoDB-----");
    } catch (err) {
        // Log an error message if connection fails
        console.log("Could not connect to MongoDB:", err);
    }
};

export default connectDB; // Export the connectDB function for use in other parts of the application
/* Environment Variables: The script retrieves MongoDB admin username (MONGO_DB_USERNAME) and password (MONGO_DB_PASSWORD) from environment variables defined in .env.local.
Connection String: It constructs a MongoDB connection string (connectionString) using MongoDB Atlas URI format.
Error Handling: If the required environment variables are not defined, an error is thrown.
ConnectDB Function: This asynchronous function attempts to connect to MongoDB using mongoose.connect. It checks if a connection is already established (mongoose.connection?.readyState >= 1) before attempting to connect.
Logging: Messages are logged to the console indicating whether the connection to MongoDB was successful or if there was an error.
 */