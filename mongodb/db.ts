import mongoose from "mongoose";

const test1 = process.env.MONGO_DB_USERNAME; // this is for db admin username
const test2 = process.env.MONGO_DB_PASSWORD; // this is for db admin password
const connectionString= `mongodb+srv://${test1}:${test2}@google-translate-web-project-kcgi.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`

if (!connectionString){
    throw new Error("please define the MONGO_DB_USERNAME and MANGO_DB_PASSWORD environment variable inside .env.local");
    
}

const connectDB = async () => {
    if (mongoose.connection?.readyState >= 1) {
        console.log("-----Already Connected to MongoDB-----");
        return;
        
    }
    try {
        await mongoose.connect(connectionString);
        console.log("-----Connected to MongoDB-----");
        
    }catch(err){
        console.log("Could not connect to MongoDb:", err);
        
    }
};

export default connectDB;