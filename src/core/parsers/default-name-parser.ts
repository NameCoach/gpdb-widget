import NameParser, { NPResult } from "../../types/name-parser";

export default class DefaultNameParser implements NameParser {
  parse(name: string): NPResult {
    if (!name.includes(" "))
      return { firstName: null, lastName: null, fullName: name };

    const parsedName = name.split(" ");
    const firstName = parsedName.slice(0, -1).join(" ").trim() || null;
    const lastName = parsedName[parsedName.length - 1] || null;
    const fullName = name;

    return { firstName, lastName, fullName };
  }
}
