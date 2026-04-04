import { useContext, useEffect, useMemo, useState } from "react";
import { TranslationContext } from "../context/TranslationContext";

/**
 * Translate a map of UI labels using TranslationContext.
 * Keeps English defaults and only translates when language != "en".
 */
export function useTranslatedLabels(labels) {
  const { language, translateText } = useContext(TranslationContext);
  const stableLabels = useMemo(() => labels, [labels]);
  const [translatedLabels, setTranslatedLabels] = useState(stableLabels);

  useEffect(() => {
    let cancelled = false;

    if (language === "en") {
      setTranslatedLabels(stableLabels);
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const entries = Object.entries(stableLabels);
        const translatedValues = await Promise.all(
          entries.map(([, value]) => translateText(value))
        );
        if (cancelled) return;
        const mapped = entries.reduce((acc, [key], index) => {
          acc[key] = translatedValues[index];
          return acc;
        }, {});
        setTranslatedLabels(mapped);
      } catch (e) {
        if (!cancelled) {
          setTranslatedLabels(stableLabels);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [language, stableLabels, translateText]);

  return translatedLabels;
}
