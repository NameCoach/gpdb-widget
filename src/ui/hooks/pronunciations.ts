import { useState } from "react";
import Pronunciation from "../../types/resources/pronunciation";
import { NameTypes } from "../../types/resources/name";

export type PronunciationsState = { [t in NameTypes]: Pronunciation[] };

export type UsePronunciationsReturn = {
  pronunciations: PronunciationsState;
  setPronunciations: (d: PronunciationsState) => void;
  updatePronunciationsByType: (type: NameTypes, data: Pronunciation[]) => void;
};

export function usePronunciations(): UsePronunciationsReturn {
  const [pronunciations, setPronunciations] = useState<PronunciationsState>({
    [NameTypes.FirstName]: [],
    [NameTypes.LastName]: [],
    [NameTypes.FullName]: [],
  });

  const updatePronunciationsByType = (
    type: NameTypes,
    data: Pronunciation[]
  ): void => setPronunciations((state) => ({ ...state, [type]: data }));

  return {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  };
}
