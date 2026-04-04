/**
 * Callable: translateText — Google Cloud Translation API (ADC in Cloud Functions).
 * Gen-1 (Node 20). Enable Cloud Translation API on the project.
 */
const functions = require("firebase-functions/v1");
const { Translate } = require("@google-cloud/translate").v2;

const MAX_CHARS = 5000;

const ALLOWED = new Set([
  "en",
  "fr",
  "es",
  "de",
  "hi",
  "zh-Hans",
  "ja",
  "ko",
  "ar",
  "ru",
  "pt",
  "it",
]);

function toGoogleTarget(code) {
  if (code === "zh-Hans") return "zh-CN";
  return code;
}

const translateClient = new Translate();

exports.translateText = functions.region("us-central1").https.onCall(async (data) => {
  const { text, targetLang } = data || {};

  if (typeof text !== "string" || text.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "text must be a non-empty string"
    );
  }
  if (text.length > MAX_CHARS) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      `text exceeds ${MAX_CHARS} characters`
    );
  }
  if (!targetLang || typeof targetLang !== "string") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "targetLang is required"
    );
  }
  if (!ALLOWED.has(targetLang)) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "unsupported targetLang"
    );
  }
  if (targetLang === "en") {
    return { translatedText: text };
  }

  try {
    const [translated] = await translateClient.translate(
      text,
      toGoogleTarget(targetLang)
    );
    return { translatedText: translated };
  } catch (err) {
    console.error("translateText error", err);
    throw new functions.https.HttpsError(
      "internal",
      err.message || "Translation failed"
    );
  }
});
