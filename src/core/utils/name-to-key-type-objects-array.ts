import NameParser from "../../types/name-parser";
import { NameTypes } from "../../types/resources/name";

const nameToKeyTypeObjectsArray = (
  name: string,
  nameParser: NameParser
): { key: string; type: NameTypes }[] => {
  const parsedNames = nameParser.parse(name);

  return Object.values(NameTypes)
    .filter((type) => parsedNames[type])
    .map((type) => ({
      key: parsedNames[type],
      type,
    }));
};

export default nameToKeyTypeObjectsArray;
