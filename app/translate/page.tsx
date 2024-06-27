import TranslationForm from '@/components/TranslationForm';
import TranslationHistory from '@/components/TranslationHistory';
import { auth } from '@clerk/nextjs/server'

export type TranslationLanguages = {
  translation: {
    [key:string]: {
      name:string;
      nativeName: string;
      dir: "ltr" | "rtl";
    };
  };
};


async function TranslatePage() {
  auth().protect();
  const {userId} = auth();
  if (!userId) throw new Error("User not logged id");

  const languagesEndpoint = "https://api.cognitive.microsofttranslator.com/languages?api-version=3.0";

  const response = await fetch(languagesEndpoint, {
    next: {
      revalidate: 60 * 60 * 24, //Cache the result for 24 hours and then refresh
    }
  });

  const languages = (await response.json()) as TranslationLanguages;

  return (
    <div className='px-10 xl:px-0 mb-20'>
      {/*TranslationForm*/}
      <TranslationForm languages={languages} />
      {/*TranslationHistory*/}
      <TranslationHistory />
    </div>
  )
}

export default TranslatePage