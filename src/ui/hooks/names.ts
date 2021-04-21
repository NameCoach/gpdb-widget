import { useState } from "react";
import Pronunciation from "../../types/resources/pronunciation";
import Name, { NameTypes } from "../../types/resources/name";

export type NameType = Name & {
  pronunciations?: Array<Pronunciation>;
  loading?: boolean;
};

export function useName(
  nameType: NameTypes,
  initState: Omit<NameType, "type">
) {
  const [name, setName] = useState<NameType>({ ...initState, type: nameType });

  const setLoading = (flag: boolean): void =>
    setName((prevName) => ({ ...prevName, loading: flag }));

  return { name, setLoading };
}
