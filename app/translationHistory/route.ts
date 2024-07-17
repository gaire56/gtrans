//Gaire Ananta Prasad M24W0272
// Import the getTranslations function from the User model in the MongoDB directory
import { getTranslations } from "@/mongodb/models/User";

// Import Next.js server-side components for handling requests and responses
import { NextRequest, NextResponse } from "next/server";

// Define an asynchronous GET handler function
export async function GET(request: NextRequest) {
  // Extract search parameters from the request URL
  const searchParams = request.nextUrl.searchParams;
  
  // Get the userId from the search parameters
  const userId = searchParams.get("userId");

  // Fetch translations for the specified userId from the database
  const translations = await getTranslations(userId!);

  // Return the translations as a JSON response
  return NextResponse.json({ translations });
}
