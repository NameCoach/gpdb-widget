interface NPResult {
  firstName: string | null;
  lastName: string | null;
}

export default class NameParser {
  parse(name: string): NPResult {
    const parsedName = name.split(" ");
    const firstName = parsedName.slice(0, -1).join(" ").trim() || null;
    const lastName = parsedName[parsedName.length - 1] || null;

    return { firstName, lastName };
  }
}
