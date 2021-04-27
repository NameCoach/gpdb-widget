import { UserResponse as UserResponseTypes } from "gpdb-api-client";

export default interface UserResponse {
  id: string;
  response: UserResponseTypes;
}
