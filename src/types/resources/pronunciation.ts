import Phonetic from "./phonetic";
import UserResponse from "./user-response";
import CustomAttribute from "./custom-attribute";

export enum AudioSource {
  Gpdb = "gpdb",
  NameOwner = "name_owner",
  NameUser = "name_user",
}

export default interface Pronunciation {
  id: string;
  audioSrc: string;
  nameOwnerCreated?: boolean;
  language?: string;
  phoneticSpelling?: string;
  userResponse?: UserResponse;
  phoneticTranscriptions?: Array<Phonetic>;
  customAttributes?: CustomAttribute[];
}
