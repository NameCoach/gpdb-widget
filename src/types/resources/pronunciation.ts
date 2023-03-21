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
  TargetSelf = "target_self",
  PeerSelf = "peer_self",
  PeerPeer = "peer_peer",
}

export enum SourceType {
  Hedb = "hedb",
  Gpdb = "gpdb",
  HedbNameBadge = "hedb_name_badge",
}

export default interface Pronunciation {
  id: string;
  sourceType: SourceType;
  audioSrc: string;
  nameOwnerCreated?: boolean;
  userCreated?: boolean;
  gpdbCreated?: boolean;
  audioCreator: AudioSource;
  isHedb?: boolean;
  language?: string;
  relativeSource?: RelativeSource;
  phoneticSpelling?: string;
  userResponse?: UserResponse;
  phoneticTranscriptions?: Array<Phonetic>;
  customAttributes?: CustomAttribute[];
  nameBadgeLink?: string;
  selfRecorded?: boolean;
}
