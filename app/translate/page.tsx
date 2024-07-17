//Gaire Ananta Prasad (M24W0272)
// Import necessary components and modules
import TranslationForm from '@/components/TranslationForm';
import TranslationHistory from '@/components/TranslationHistory';
import { auth } from '@clerk/nextjs/server'

// Define the structure of the TranslationLanguages type
export type TranslationLanguages = {
  translation: {
    [key: string]: {
      name: string;
      nativeName: string;
      dir: "ltr" | "rtl";
    };
  };
};

// Define the TranslatePage component as an asynchronous function
async function TranslatePage() {
  // Protect the route with Clerk authentication
  auth().protect();

  // Get the current user's ID
  const { userId } = auth();

  // Throw an error if the user is not authenticated
  if (!userId) throw new Error("User not logged in");

  // Define the endpoint for fetching supported languages from Microsoft Translator API
  const languagesEndpoint = "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0";

  // Fetch the languages data from the API
  const response = await fetch(languagesEndpoint, {
    next: {
      revalidate: 60 * 60 * 24, // Cache the result for 24 hours and then refresh
    }
  });

  // Parse the response JSON as TranslationLanguages type
  const languages = (await response.json()) as TranslationLanguages;

  // Render the page with TranslationForm and TranslationHistory components
  return (
    <div className='px-10 xl:px-0 mb-20'>
      {/* TranslationForm component with fetched languages as a prop */}
      <TranslationForm languages={languages} />
      {/* TranslationHistory component */}
      <TranslationHistory />
    </div>
  )
}

// Export the TranslatePage component as the default export
export default TranslatePage;
