import { useState, useCallback } from "react";
import { HIGHLIGHT_DURATION } from "@/utils/constants";

/**
 * Highlight type: can be "increase" or "decrease"
 */
type HighlightType = "increase" | "decrease";

/**
 * Highlights object type:
 * key: odds ID (string)
 * value: HighlightType
 */
type Highlights = Record<string, HighlightType>;

/**
 * Hook that manages temporary highlighting of odds changes
 *
 * @returns {
 *   highlights: Highlights object
 *   highlightOdds: function to add highlight by odds ID and type
 * }
 */
export const useOddsHighlight = () => {
  const [highlights, setHighlights] = useState<Highlights>({});

  const highlightOdds = useCallback((oddsId: string, type: HighlightType) => {
    setHighlights((prev) => ({
      ...prev,
      [oddsId]: type,
    }));

    setTimeout(() => {
      setHighlights((prev) => {
        const newHighlights = { ...prev };
        delete newHighlights[oddsId];
        return newHighlights;
      });
    }, HIGHLIGHT_DURATION);
  }, []);

  return {
    highlights,
    highlightOdds,
  };
};
