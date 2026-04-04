import { useState } from "react";
import { translateRemote } from "../lib/translationApi";

/** @deprecated Prefer TranslationContext.translateText */
export const translateText = async (text, language) => {
  if (!text || language === 'en') return text;
  return translateRemote(text, language);
};

export function useTranslation() {
    const language = navigator.language || 'en'; // Default to English if no language is set
    const [translation, setTranslation] = useState();

    const t = (text) => {
        translateText(text, language)
            .then((translatedText) => {
                setTranslation(translatedText);
            })


        return translation || text; // Return translated text or original if not translated yet
    }

    return t;
    
}