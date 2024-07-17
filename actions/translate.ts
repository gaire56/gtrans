/**
 * Gaire Ananta Prasad
 */
'use server';

// Import necessary modules and functions
import { State } from "@/components/TranslationForm";
import connectDB from "@/mongodb/db";
import { addOrUpdateUser } from "@/mongodb/models/User";
// import { ITranslation } from "@/mongodb/models/User";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";
import { revalidateTag } from "next/cache";
import { v4 } from "uuid";

// Retrieve environment variables for Azure Translation API
const key = process.env.AZURE_TEXT_TRANSLATION_KEY;
const endpoint = process.env.AZURE_TEXT_TRANSLATION;
const location = process.env.AZURE_TEXT_LOCATION;

// Function to handle translation requests and updating the database
async function translate(prevState: State, formData: FormData) {
  // Ensure the request is authenticated
  auth().protect();

  // Get the userId from the authentication context
  const { userId } = auth();

  // Throw an error if userId is not found
  if (!userId) throw new Error("User not found");

  // Extract form data
  const rawFormData = {
    input: formData.get("input") as string,
    inputLanguage: formData.get("inputLanguage") as string,
    output: formData.get("output") as string,
    outputLanguage: formData.get("outputLanguage") as string,
  };

  // Send a request to the Azure Translator API to translate the input text
  const response = await axios({
    baseURL: endpoint, // Base URL for the Azure Translation API
    url: "translate", // Endpoint for the translate function
    method: "POST", // HTTP method
    headers: {
      "Ocp-Apim-Subscription-key": key!, // Subscription key for Azure API
      "Ocp-Apim-Subscription-Region": location!, // Subscription region for Azure API
      "Content-Type": "application/json", // Content type of the request
      "X-ClientTraceId": v4().toString(), // Unique client trace ID
    },
    params: {
      "api-version": "3.0", // API version
      from: rawFormData.inputLanguage === "auto" ? null : rawFormData.inputLanguage, // Source language
      to: rawFormData.outputLanguage, // Target language
    },
    data: [
      {
        text: rawFormData.input, // Text to be translated
      },
    ],
    responseType: "json", // Response type expected from API
  });

  // Retrieve the data from the response
  const data = response.data;

  // Log an error if the API response contains an error
  if (data.error) {
    console.log(`Error ${data.error.code}: ${data.error.message}`);
  }

  // Connect to the MongoDB database
  await connectDB();

  // If the input language is set to "auto", set it to the detected language from the API response
  if (rawFormData.inputLanguage === "auto") {
    rawFormData.inputLanguage = data[0].detectedLanguage.language;
  }

  try {
    // Define the translation object
    const translation = {
      to: rawFormData.outputLanguage, // Target language
      from: rawFormData.inputLanguage, // Source language
      fromText: rawFormData.input, // Original text
      toText: data[0].translations[0].text, // Translated text
    };

    // Add or update the user with the new translation in the database
    await addOrUpdateUser(userId, translation);
  } catch (error) {
    // Log an error if there is an issue adding the translation to the user
    console.error("Error adding translation to user:", error);
  }

  // Revalidate the translation history cache tag
  revalidateTag("translationHistory");

  // Return the updated state with the translated text
  return {
    ...prevState,
    output: data[0].translations[0].text,
  };
}

// Export the translate function as the default export
export default translate;
/*
* Imports and Initial Setup:

Module Imports: Import necessary modules and functions, including auth for authentication, axios for making HTTP requests, and database-related modules.
Environment Variables: Retrieve environment variables for Azure Translation API keys and endpoint.
Translation Function:

Function Definition: The translate function is defined to handle translation requests and update the database with the new translation.
Authentication: The function starts by ensuring the request is authenticated using auth().protect().
User ID Extraction: Extracts the authenticated user's ID and throws an error if the user is not found.
Form Data Extraction: Extracts form data from the FormData object.
Azure Translation API Request:

API Request: Sends a request to the Azure Translator API to translate the input text, setting appropriate headers and parameters.
Error Handling: Handles the API response, logging any errors.
Database Operations:

Database Connection: Connects to the MongoDB database.
Language Detection: If the input language is set to "auto", sets it to the detected language from the API response.
Translation Object: Defines the translation object containing the translated text and languages.
Database Update: Tries to add or update the user with the new translation in the database, handling any errors that occur.
Cache Revalidation:

Cache Update: Revalidates the translation history cache tag to ensure the latest translations are available.
Return Statement:

Return Data: Returns the updated state with the translated text.
Export:

Function Export: Exports the translate function as the default export of the module.
 */
