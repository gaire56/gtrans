//Gaire Ananta Prasad (M24W0272)
'use client'; // Indicates this is a client-side component

import { TrashIcon } from "lucide-react"; // Import TrashIcon from lucide-react
import { Button } from "./ui/button"; // Import Button component from UI library
import deleteTranslation from "@/actions/deleteTranslation"; // Import deleteTranslation action

// DeleteTranslationButton component to handle deletion of translations
function DeleteTranslationButton({ id }: { id: string }) {
    // Bind deleteTranslation action with the translation ID
    const deleteTranslationAction = deleteTranslation.bind(null, id);

    return (
        <form action={deleteTranslationAction}>
            {/* Button for deleting translation */}
            <Button
                type="submit"
                variant="outline"
                size="icon"
                className="border-red-500 text-red-500 hover:bg-red-400 hover:text-white"
            >
                <TrashIcon size={16} /> {/* Trash icon */}
            </Button>
        </form>
    );
}

export default DeleteTranslationButton; // Export DeleteTranslationButton component as default
