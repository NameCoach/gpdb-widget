import { useState } from "react";
import Pronunciation from "../../types/resources/pronunciation";
import { NameTypes } from "../../types/resources/name";

type PronunciationsState = { [t in NameTypes]: Pronunciation[] };

type HookReturn = {
  pronunciations: PronunciationsState;
  setPronunciations: (d: PronunciationsState) => void;
  updatePronunciationsByType: (type: NameTypes, data: Pronunciation[]) => void;
};

export function usePronunciations(): HookReturn {
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
