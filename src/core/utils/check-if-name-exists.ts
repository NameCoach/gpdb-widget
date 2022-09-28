import Name, { NameTypes } from "../../types/resources/name";

const checkIfNameExist = (
  currentName: Name,
  type: NameTypes,
  pronunciationsLength: number
): boolean => {
  const ofTheSameType = currentName.type === type;
  const pronunciationsExist = pronunciationsLength > 0;

  if (ofTheSameType && pronunciationsExist) return true;

  return ofTheSameType ? false : currentName.exist;
};

export default checkIfNameExist;
