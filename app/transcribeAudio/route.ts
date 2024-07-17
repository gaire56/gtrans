/** Gaire Ananta Prasad(M24W0272)
 * This code defines a server-side handler for processing audio file uploads and transcribing them using Azure's OpenAI service.
 * It includes error handling for missing Azure credentials and empty file uploads, ensuring a robust implementation. * 
 */
// Import necessary modules from Next.js and Azure OpenAI SDK
import { NextRequest, NextResponse } from "next/server";
import { AzureKeyCredential, OpenAIClient } from "@azure/openai";

// Define an asynchronous POST handler function
export async function POST(request: NextRequest) {
  // Retrieve form data from the request
  const formData = await request.formData();
  const file = formData.get("audio") as File;
  console.log(">>", file);

  // Check if Azure credentials are set in environment variables
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return NextResponse.json({ 
      error: "Azure credentials not set"
    });
  }

  // Check if an audio file was uploaded
  if (file.size === 0) {
    return NextResponse.json({
      error: "No audio file uploaded"
    });
  }

  // Convert the uploaded file to a Uint8Array
  const arrayBuffer = await file.arrayBuffer();
  const audio = new Uint8Array(arrayBuffer);

  // Initialize the OpenAIClient with Azure endpoint and API key
  const client = new OpenAIClient(
    process.env.AZURE_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_API_KEY)
  );

  // Get the audio transcription from Azure OpenAI service
  const result = await client.getAudioTranscription(
    process.env.AZURE_DEPLOYMENT_NAME,
    audio
  );

  // Log the transcription result
  console.log(`Transcription: ${result.text}`);

  // Return the transcription result as a JSON response
  return NextResponse.json({ text: result.text });
}
