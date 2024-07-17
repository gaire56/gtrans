//Gaire Ananta Prasad (M24W0272)
"use client";  // Mark this component as a Client Component

// Import necessary modules and components
import translate from "@/actions/translate";
import { TranslationLanguages } from "@/app/translate/page";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import SubmitButton from "./SubmitButton";
import { Button } from "./ui/button";
import { Volume2Icon } from "lucide-react";
import Recorder from "./Recorder";

// Define the initial state for the form
const initialState = {
  inputLanguage: "auto",
  input: "",
  outputLanguage: "en",
  output: "",
};

// Define the type for the state
export type State = typeof initialState;

// Define the TranslationForm component
function TranslationForm({ languages }: { languages: TranslationLanguages }) {
  // Initialize form state with useFormState hook
  const [state, formAction] = useFormState(translate, initialState);

  // Local state for input and output text
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Reference for the submit button
  const submitButtonReference = useRef<HTMLButtonElement>(null);

  // useEffect hook to handle automatic form submission after a delay
  useEffect(() => {
    if (!input.trim()) return;

    const delayDebounceFunction = setTimeout(() => {
      // Submit the form
      submitButtonReference.current?.click();
    }, 1000);

    return () => clearTimeout(delayDebounceFunction);
  }, [input]);

  // useEffect hook to update output text when state output changes
  useEffect(() => {
    if (state.output) {
      setOutput(state.output);
    }
  }, [state]);

  // Function to play the translated text as audio
  const playAudio = async () => {
    const synth = window.speechSynthesis;

    if (!output || !synth) return;

    const wordsToSay = new SpeechSynthesisUtterance(output);
    synth.speak(wordsToSay);
  };

  // Function to upload audio and transcribe it to text
  const uploadAudio = async (blob: Blob) => {
    const mimeType = "audio/webm";

    const file = new File([blob], mimeType, { type: mimeType });

    const formData = new FormData();
    formData.append("audio", file);

    const response = await fetch("/transcribeAudio", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.text) {
      setInput(data.text);
    }
  };

  // Render the TranslationForm component
  return (
    <div>
      <form action={formAction}>
        <div className="flex space-x-2">
          {/* Logo and text label */}
          <div className="flex items-center group cursor-pointer border rounded-md w-fit px-3 py-2 bg-[#E7F0FE] mb-5">
            <Image 
              src="https://links.papareact.com/r9c"
              alt="logo"
              width={30}
              height={30}
            />
            <p className="text-sm font-medium text-blue-500 group-hover:underline ml-2 mt-1">
              Text
            </p>
          </div>

          {/* Recorder Component */}
          <Recorder uploadAudio={uploadAudio} />
        </div>
        <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-2">
          {/* Input section */}
          <div className="flex-1 space-y-2">
            <Select name="inputLanguage" defaultValue="auto">
              <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                <SelectValue placeholder="Select a Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Want us to figure it out?</SelectLabel>
                  <SelectItem key="auto" value="auto">Auto-Detection</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {Object.entries(languages.translation).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Textarea 
              placeholder="Type your message here."
              className="min-h-32 text-xl"
              name="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Output section */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Select name="outputLanguage" defaultValue="en">
                <SelectTrigger className="w-[280px] border-none text-blue-500 font-bold">
                  <SelectValue placeholder="Select a Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Want us to figure it out?</SelectLabel>
                    <SelectItem key="auto" value="auto">Auto-Detection</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Language</SelectLabel>
                    {Object.entries(languages.translation).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                type="button"
                onClick={playAudio}
                disabled={!output}
              >
                <Volume2Icon
                  size={24}
                  className="text-blue-500 cursor-pointer disabled:cursor-not-allowed"
                />
              </Button>
            </div>

            <Textarea 
              placeholder="Type your message here."
              className="min-h-32 text-xl"
              name="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          {/* Submit button (hidden) */}
          <SubmitButton disabled={!input} />
          <button type="submit" ref={submitButtonReference} hidden />
        </div>
      </form>
    </div>
  )
}

// Export the TranslationForm component as the default export
export default TranslationForm;
