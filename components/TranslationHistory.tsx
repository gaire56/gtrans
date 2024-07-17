/**Gaire Ananta Prasad (M24W0272)
 * This code defines a TranslationHistory component that fetches and displays a user's translation history.
 * It includes functionality to display language names using Intl.DisplayNames,
 * render translation details such as source and target texts, and show timestamps using TimeAgoText.
 * The component also handles cases where there are no translations available.
 */
import { ITranslation } from "@/mongodb/models/User"; // Import ITranslation interface from User model
import { auth } from "@clerk/nextjs/server"; // Import auth function from Clerk for authentication
import DeleteTranslationButton from "./DeleteTranslationButton"; // Import DeleteTranslationButton component
// import TimeAgo from "react-timeago";
import TimeAgoText from "./TimeAgoText"; // Import TimeAgoText component

// Function to get language name based on language code using Intl.DisplayNames
const getLanguage = (code: string) => {
  const lang = new Intl.DisplayNames(["en"], { type: "language" });
  return lang.of(code);
};

async function TranslationHistory() {
  const { userId } = auth(); // Get authenticated user ID

  // Construct URL for fetching translation history based on environment
  const url = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.VERCEL_URL
  }/translationHistory?userId=${userId}`;

  // Fetch translation history data
  const response = await fetch(url, {
    next: {
      tags: ["translationHistory"], // Specify tags for the fetch request
    },
  });

  // Parse JSON response to extract translations
  const { translations }: { translations: Array<ITranslation> } =
    await response.json();

  return (
    <div className="">
      <h1 className="text-3xl my-5">History</h1>

      {/* Show a message if there are no translations */}
      {translations.length === 0 && (
        <p className="mb-5 text-gray-400">No translations yet</p>
      )}

      {/* Show a list of translations */}
      <ul className="divide-y border rounded-md">
        {translations.map((translation) => (
          <li
            key={translation._id as string}
            className="flex justify-between items-center p-5 hover:bg-gray-50 relative"
          >
            <div>
              {/* Display source and target languages */}
              <p className="text-sm mb-5 text-gray-500">
                {getLanguage(translation.from)}
                {" -> "}
                {getLanguage(translation.to)}
              </p>

              <div className="space-y-2 pr-5">
                {/* Display source and target texts */}
                <p>{translation.fromText}</p>
                <p className="text-gray-400">{translation.toText}</p>
              </div>
            </div>

            {/* Display timestamp using TimeAgoText component */}
            <p className="text-sm text-gray-300 absolute top-2 right-2">
              <TimeAgoText
                date={new Date(translation.timestamp).toISOString()}
              />
            </p>

            {/* Render DeleteTranslationButton component */}
            <DeleteTranslationButton id={translation._id as string} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TranslationHistory; // Export TranslationHistory component as default
