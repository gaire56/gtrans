//Gaire Ananta Prasad (M24W0272)
"use client";  // Mark this component as a Client Component

// Import necessary hooks and components from React, Clerk, Next.js, and custom components
import { useEffect, useState } from "react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

// Define Google colors to be used in the component
const googleColors = {
  red: "#DB4437",
  blue: "#4285F4",
  green: "#0F9D58",
  yellow: "#F4B400",
};

// Define the ClientHeader component, accepting a userId prop
function ClientHeader({ userId }: { userId: string | null }) {
  // State to hold the current time
  const [time, setTime] = useState(new Date());

  // useEffect hook to update the time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Cleanup the timer when the component is unmounted
    return () => clearInterval(timer);
  }, []);

  // Function to format the time as a string
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Render the header component
  return (
    <header className="flex items-center justify-between px-8 border-b mb-5">
      {/* Logo section with a link to the homepage */}
      <div className="flex items-center justify-center h-20 overflow-hidden">
        <Link href="/">
          <Image
            src="https://links.papareact.com/xgu"
            alt="logo"
            width={200}
            height={100}
            className="object-contain h-32 cursor-pointer"
          />
        </Link>
      </div>
      
      {/* Center section displaying user name and ID */}
      <div className="flex flex-col items-center mx-4 text-center">
        <div className="font-bold text-xl">Gaire Ananta Prasad</div>  
        <div className="text-sm">M24W0272</div>  
      </div>
      
      {/* Right section with the current time and user authentication status */}
      <div className="flex items-center">
        <div className="mr-4" style={{ color: googleColors.blue }}>
          {formatTime(time)}
        </div>
        {userId ? (
          <div>
            <UserButton />
          </div>
        ) : (
          <SignInButton signUpFallbackRedirectUrl="/translate" mode="modal" />
        )}
      </div>
    </header>
  );
}

// Export the ClientHeader component as the default export
export default ClientHeader;
