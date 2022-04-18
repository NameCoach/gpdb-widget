import Phonetic from "./phonetic";
import UserResponse from "./user-response";
import CustomAttribute from "./custom-attribute";

export enum AudioSource {
  Gpdb = "gpdb",
  NameOwner = "name_owner",
  NameUser = "name_user",
}

export enum RelativeSource {
  Gpdb = "gpdb",
  RequesterSelf = "requester_self",
  RequesterPeer = "requester_peer",
  PeerSelf = "peer_self",
  PeerPeer = "peer_peer",
}

export default interface Pronunciation {
  id: string;
  audioSrc: string;
  nameOwnerCreated?: boolean;
  userCreated?: boolean;
  gpdbCreated?: boolean;
  audioCreator: AudioSource;
  isHedb?: boolean;
  language?: string;
  relativeSource?: string;
  phoneticSpelling?: string;
  userResponse?: UserResponse;
  phoneticTranscriptions?: Array<Phonetic>;
  customAttributes?: CustomAttribute[];
  nameBadgeLink?: string;
}
