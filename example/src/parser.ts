import { NameParser, NPResult } from 'gpdb-widget'

const split = (name: string, char: string) => {
    const parsedName = name.split(char);
    const firstName = parsedName.slice(0, -1).join(char).trim() || null;
    const lastName = parsedName[parsedName.length - 1] || null;
    const fullName = name.replace(/\./, " ");

    return { firstName, lastName, fullName };
};

export default class Parser implements NameParser {
  parse(name: string): NPResult {
    const trimmedName = name.trim();
    if (!trimmedName.includes(" ") && !trimmedName.includes("@")) return { firstName: null, lastName: null, fullName: trimmedName };

    if (trimmedName.includes(" ")) {
        return split(trimmedName, " ");
    }
    else {
        return split(trimmedName.split("@")[0], ".");
    }
  }
}
