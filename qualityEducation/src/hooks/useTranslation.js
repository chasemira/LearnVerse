import axios from "axios";
import { useState } from "react";

const apiKey = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const endpoint = import.meta.env.VITE_AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com';
const region = import.meta.env.VITE_AZURE_TRANSLATOR_REGION || 'canadaeast';

// Function to translate text
export const translateText = async (text, language) => {
  if (!text || language === 'en' || !apiKey) return text; // Skip if English or missing API key

  try {
    const response = await axios.post(
      `${endpoint}/translate?api-version=3.0&to=${language}`,
      [{ Text: text }],
      {
        headers: {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-type': 'application/json',
          'Ocp-Apim-Subscription-Region': region,
        },
      }
    );
    return response.data[0].translations[0].text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // fallback to original text on error
  }
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