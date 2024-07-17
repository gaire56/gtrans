//Gaire Ananta Prasad M24W0272

// Import necessary modules and types from mongoose and the local db connection utility
import mongoose, { Document, Schema } from "mongoose";
import connectDB from "../db";

// Define an interface for the Translation document that extends the Mongoose Document
export interface ITranslation extends Document {
  timestamp: Date;
  fromText: string;
  from: string;
  toText: string;
  to: string;
}

// Define an interface for the User document that extends the Mongoose Document
interface IUser extends Document {
  userId: string;
  translations: Array<ITranslation>;
}

// Define the schema for a Translation document
const translationSchema = new Schema({
  timestamp: { type: Date, default: Date.now }, // Set default value to current date
  fromText: String, // Source text
  from: String,     // Source language
  toText: String,   // Translated text
  to: String,       // Target language
});

// Define the schema for a User document, which includes an array of Translation documents
const userSchema = new Schema<IUser>({
  userId: String,             // Unique user identifier
  translations: [translationSchema], // Array of translation documents
});

// Check if the User model already exists to prevent overwriting it
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

// Function to add or update a user with a new translation
export async function addOrUpdateUser(
  userId: string,
  translation: {
    fromText: string;
    from: string;
    toText: string;
    to: string;
  }
): Promise<IUser> {
  // Define the filter to find the user by userId
  const filter = { userId: userId };
  // Define the update to set the userId and push the new translation
  const update = {
    $set: { userId: userId },
    $push: { translations: translation },
  };

  // Connect to the database
  await connectDB();

  // Upsert option ensures that the document is created if it doesn't exist
  // The new: true option ensures that the method returns the updated document after the operation
  // The setDefaultsOnInsert option ensures that default values are applied when inserting a new document
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  try {
    // Find the user by userId and update or insert if not found
    const user: IUser | null = await User.findOneAndUpdate(filter, update, options);
    console.log("User added or updated:", user);

    // If user is not found or created, throw an error
    if (!user) {
      throw new Error("User not found and was not created.");
    }

    // Return the updated user document
    return user;
  } catch (err) {
    console.error("Error adding or updating user:", err);
    throw err; // Rethrow the error to handle it outside this function
  }
}

// Function to remove a translation by its ID for a given user
export async function removeTranslation(
  userId: string,
  translationId: string
): Promise<IUser> {
  // Connect to the database
  await connectDB();

  try {
    // Find the user by userId and remove the translation with the given _id
    const user: IUser | null = await User.findOneAndUpdate(
      { userId: userId }, // Find the user with the given userId
      { $pull: { translations: { _id: translationId } } }, // Remove the translation with the given _id
      { new: true } // Return the updated document
    );
    
    // If user is not found, throw an error
    if (!user) {
      throw new Error("User not found.");
    }
    console.log("Translation removed:", user);

    // Return the updated user document
    return user;
  } catch (err) {
    console.error("Error removing translation:", err);
    throw err; // Rethrow the error to handle it outside this function
  }
}

// Function to get translations for a given user, sorted by timestamp in descending order
export async function getTranslations(
  userId: string
): Promise<Array<ITranslation>> {
  // Connect to the database
  await connectDB();

  try {
    // Find the user by userId
    const user: IUser | null = await User.findOne({ userId: userId });
    
    // If user is found, sort translations by timestamp in descending order and return them
    if (user) {
      user.translations.sort(
        (a: ITranslation, b: ITranslation) =>
          b.timestamp.getTime() - a.timestamp.getTime()
      );

      return user.translations;
    } else {
      console.log(`User with userId ${userId} not found.`);
      return []; // Return an empty array if user is not found
    }
  } catch (err) {
    console.error("Error retrieving translations:", err);
    throw err; // Rethrow the error to handle it outside this function
  }
}

// Export the User model as the default export
export default User;
/* This code defines a Mongoose model for users and their translations, providing functions to add/update users,
* remove translations, and get translations. It connects to the database and handles possible errors during these operations.
*/