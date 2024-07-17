/*
 * GAIRE ANANTA PRASAD ID: M24W0272
 * This component is the main entry point for the home page of a Next.js application.
 * It displays a title, an image, and a button that either links to the translation page 
 * or prompts the user to sign in, depending on the user's authentication status.
 */

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

// Asynchronous function that serves as the main component for the home page
export default async function Home() {
  // Get the current user's ID using Clerk authentication
  const { userId } = auth();

  return (
    // Main container with flexbox layout for centering content
    <main className="flex flex-col items-center justify-center p-10">
      {/* Title of the page */}
      <h1 className="text-3xl lg:text-6xl text-center pb-10 mb-5 font-light">
        Understand your world and communicate across languages
      </h1>
      
      {/* Display an image with specified source, alt text, and dimensions */}
      <Image
        src="https://links.papareact.com/ert"
        alt="logo"
        width={700}
        height={600}
      />

      {/* Conditional rendering based on user authentication status */}
      {userId ? (
        // If user is authenticated, show a link to the translation page
        <Link
          href="/translate"
          className="bg-blue-500 hover:bg-blue-600 w-full mt-10 lg:w-fit p-5 rounded-md text-white text-center cursor-pointer"
        >
          Translate Now
        </Link>
      ) : (
        // If user is not authenticated, show a sign-in button
        <Button className="bg-blue-500 hover:bg-blue-600 w-full mt-10 lg:w-fit p-5">
          <SignInButton afterSignInUrl={'/translate'} mode="modal">
            Sign In to Get Translating
          </SignInButton>
        </Button>
      )}
    </main>
  );
}
