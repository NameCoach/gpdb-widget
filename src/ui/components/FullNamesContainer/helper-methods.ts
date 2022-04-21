import Name, { NameTypes } from "../../../types/resources/name";

export const nameExist = (
  currentName: Name,
  type: NameTypes,
  pronunciationsLength: number
): boolean => {
  const ofTheSameType = currentName.type === type;
  const pronunciationsExist = pronunciationsLength > 0;

  if (ofTheSameType && pronunciationsExist) return true;

  return ofTheSameType ? false : currentName.exist;
};
