//Gaire Ananta Prasad M24W0272
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Create route matchers for specific routes (currently commented out)
// const isDashboardRoute = createRouteMatcher(["/dashboard(.*)"]);
// const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Middleware function to handle authentication and authorization

  // Example: Restrict admin route to users with specific role
  // if (isAdminRoute(req)) auth().protect({ role: "org:admin" });

  // Example: Restrict dashboard routes to logged-in users
  // if (isDashboardRoute(req)) auth().protect();
});

// Configuration for clerkMiddleware
export const config = {
  // Matcher defines which routes are covered by clerkMiddleware
  matcher: [
    "/((?!.*\\..*|_next).*)", // Match all routes except those containing a dot (likely static files)
    "/", // Match root route
    "/translate", // Match translate route
    "/(api|trpc)(.*)" // Match API routes
  ],
};
/**
 * clerkMiddleware: This function is used as middleware to manage authentication and authorization using Clerk's authentication service (auth()).
createRouteMatcher: It creates route matchers based on route patterns. In your example, isDashboardRoute and isAdminRoute would be used to match specific dashboard and admin routes respectively, but they are currently commented out.
Middleware Function: Inside clerkMiddleware, you can add logic to restrict access based on route patterns (req) and authentication (auth()).
Configuration (config): Defines which routes (matcher) are covered by the clerkMiddleware. Routes include all paths except those likely serving static files (.*\\..*) and specific routes like root, translate, and API routes (/api and /trpc).
This setup allows you to enforce authentication and possibly role-based access control (if uncommented and implemented) for different parts of your application using Clerk's authentication middleware in Next.js.
 */