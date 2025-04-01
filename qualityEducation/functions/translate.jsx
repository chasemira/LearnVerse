import axios from "axios";

const apiKey = import.meta.env.VITE_AZURE_TRANSLATOR_KEY;
const endpoint = "https://api.cognitive.microsofttranslator.com/translate";  // Your Azure endpoint
const location = "canadaeast";  // Example: "eastus" (find in Azure portal)

export const translateText = async (text, targetLang) => {
  try {
    const response = await axios.post(
      `${endpoint}?api-version=3.0&to=${targetLang}`,
      [{ text }],
      {
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          "Ocp-Apim-Subscription-Region": location,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data[0].translations[0].text; // Return translated text
  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Fallback to original text if translation fails
  }
};
