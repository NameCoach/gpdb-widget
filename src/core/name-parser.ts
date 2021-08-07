interface NPResult {
  firstName: string | null;
  lastName: string | null;
}

export default class NameParser {
  parse(name: string): NPResult {
    if (!name.includes(" ")) return { firstName: null, lastName: null };

    const parsedName = name.split(" ");
    const firstName = parsedName.slice(0, -1).join(" ").trim() || null;
    const lastName = parsedName[parsedName.length - 1] || null;

    return { firstName, lastName };
  }
}
