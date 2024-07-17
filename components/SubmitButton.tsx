/*Gaire Ananta Prasad (M24W0272)
This code defines a SubmitButton component that displays a button to submit a form.
The button is disabled if the form is pending or if the disabled prop is true.
The text of the button changes based on the form's pending status.
*/
"use client"; // Indicates this is a client-side component

import { useFormStatus } from "react-dom"; // Import useFormStatus hook to track form status
import { Button } from "./ui/button"; // Import Button component from the UI library

// SubmitButton component to handle form submission
function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus(); // Get the pending state of the form

  return (
    <Button
      type="submit" // Set button type to submit
      disabled={disabled || pending} // Disable button if disabled prop or pending state is true
      className="bg-blue-500 hover:bg-blue-600 w-full lg:w-fit" // Set button styles
    >
      {pending ? "Translating..." : "Translate"} // Show "Translating..." if form is pending, otherwise show "Translate"
    </Button>
  );
}

export default SubmitButton; // Export the SubmitButton component as default
