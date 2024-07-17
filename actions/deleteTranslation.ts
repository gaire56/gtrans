'use server';

import { removeTranslation } from "@/mongodb/models/User"; // Import removeTranslation function from User model
import { auth } from "@clerk/nextjs/server"; // Import auth function from Clerk for authentication
import { revalidateTag } from "next/cache"; // Import revalidateTag function from next/cache for cache invalidation

// Async function to delete a translation
async function deleteTranslation(id: string) {
    auth().protect(); // Ensure user is authenticated

    const { userId } = auth(); // Get the authenticated user's ID

    // Remove the translation associated with the user ID and translation ID
    const user = await removeTranslation(userId!, id);

    // Invalidate cache tag to trigger revalidation of translation history
    revalidateTag("translationHistory");

    // Return updated translations as JSON string
    return {
        translations: JSON.stringify(user.translations),
    };
}

export default deleteTranslation; // Export deleteTranslation function for use in other parts of the application
