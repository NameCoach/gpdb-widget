export enum UserResponseTypes {
  Save = "save",
  Reject = "reject",
  NoOpinion = "noOpinion",
}

export default interface UserResponse {
  id: string;
  response: UserResponseTypes;
}
