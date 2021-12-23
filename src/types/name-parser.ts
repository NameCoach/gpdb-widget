export interface NPResult {
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
}

export default interface NameParser {
  parse: (name: string) => NPResult;
}
