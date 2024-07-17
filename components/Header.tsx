//Gaire Ananta Prasad (M24W0272)
// Import the auth module from Clerk for user authentication
import { auth } from "@clerk/nextjs/server";

// Import the ClientHeader component
import ClientHeader from "./ClientHeader";

// Define the Header component
function Header() {
  // Get the current user's ID using Clerk authentication
  const { userId } = auth();

  // Log the user ID to the console for debugging purposes
  console.log("User ID:", userId);

  // Render the ClientHeader component, passing the user ID as a prop
  return <ClientHeader userId={userId} />;
}

// Export the Header component as the default export
export default Header;
