const functions = require("firebase-functions");
const axios = require("axios");

// For local development (optional)
require("dotenv").config();

const VITE_AZURE_TRANSLATOR_KEY = process.env.VITE_AZURE_TRANSLATOR_KEY || functions.config().azure_translator.key;
const VITE_AZURE_TRANSLATOR_ENDPOINT = process.env.VITE_AZURE_TRANSLATOR_ENDPOINT || functions.config().azure_translator.endpoint;
const VITE_AZURE_TRANSLATOR_REGION = process.env.VITE_AZURE_TRANSLATOR_REGION || functions.config().azure_translator.region;

exports.translateText = functions.https.onRequest(async (req, res) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }
  
  const { text, target } = req.body;
  if (!text || !target) {
    return res.status(400).send("Missing 'text' or 'target' parameter.");
  }
  
  try {
    // Build the request URL (using API version 3.0)
    const url = `${VITE_AZURE_TRANSLATOR_ENDPOINT}/translate?api-version=3.0&to=${target}`;
    
    // Azure expects an array of objects with a "Text" property
    const requestBody = [{ Text: text }];
    
    const headers = {
      "Ocp-Apim-Subscription-Key": VITE_AZURE_TRANSLATOR_KEY,
      "Ocp-Apim-Subscription-Region": VITE_AZURE_TRANSLATOR_REGION,
      "Content-Type": "application/json"
    };
    
    const response = await axios.post(url, requestBody, { headers });
    // Azure returns translations in an array; get the first result's first translation.
    const translatedText = response.data[0].translations[0].text;
    
    res.status(200).send({ translatedText });
  } catch (error) {
    console.error("Translation error:", error.response ? error.response.data : error);
    res.status(500).send("Translation error");
  }
});
