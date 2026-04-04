import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase/firebase";

let _translateCallable = null;

function getTranslateCallable() {
  if (!_translateCallable) {
    _translateCallable = httpsCallable(functions, "translateText");
  }
  return _translateCallable;
}

/**
 * Server-side translation (Google Cloud Translation via Firebase Callable).
 * @param {string} text
 * @param {string} targetLang - e.g. 'es', 'zh-Hans'
 * @returns {Promise<string>}
 */
export async function translateRemote(text, targetLang) {
  if (!text || targetLang === "en") return text;
  try {
    const fn = getTranslateCallable();
    const result = await fn({ text, targetLang });
    return result.data.translatedText ?? text;
  } catch (err) {
    console.warn("translateRemote failed (deploy functions + enable Cloud Translation API):", err);
    return text;
  }
}
