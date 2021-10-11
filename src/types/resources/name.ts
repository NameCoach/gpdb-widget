export enum NameTypes {
  FirstName = "firstName",
  LastName = "lastName",
  FullName = "fullName",
}

export default interface Name {
  key: string;
  exist: boolean;
  type: NameTypes;
  isRequested?: boolean;
}
