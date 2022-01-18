import Name, { NameTypes } from "./resources/name";
import Pronunciation from "./resources/pronunciation";
import {
  NameOwner,
  User,
  UserResponse,
  PermissionsManager,
} from "gpdb-api-client";
import NameParser from "./name-parser";
import { loadParams } from "gpdb-api-client/build/main/types/repositories/permissions";

export interface Meta {
  uri?: string;
}

export interface PublicAttributes {
  nameOwnerContext: NameOwner;
  userContext: User;
  nameParser: NameParser;
}

export interface GpdbRequests {
  permissions: PermissionsManager;
  complexSearch: (
    names: Array<Omit<Name, "exist">>,
    nameOwner?: NameOwner,
    meta?: Meta
  ) => PromiseLike<{ [t in NameTypes]: Pronunciation[] }>;
  simpleSearch: (
    name: Omit<Name, "exist">,
    nameOwner?: NameOwner,
    meta?: Meta
  ) => PromiseLike<Pronunciation[]>;
  searchBySig: (
    nameOwner?: NameOwner
  ) => PromiseLike<
    [Array<Omit<Name, "exist">>, { [t in NameTypes]: Pronunciation[] }]
  >;
  createUserResponse: (
    id: string,
    type: UserResponse,
    nameOwner?: NameOwner
  ) => PromiseLike<void>;
  createRecording: (
    name: string,
    type: NameTypes,
    audio: string,
    owner?: NameOwner
  ) => PromiseLike<void>;
  requestRecording: (
    name: string,
    type: NameTypes,
    nameOwner?: NameOwner
  ) => PromiseLike<void>;
  findRecordingRequest: (
    name: string,
    type: NameTypes,
    nameOwner?: NameOwner
  ) => PromiseLike<boolean>;
  loadPermissions: (rest?: loadParams) => PromiseLike<void>;
}

export interface NamesServiceRequests {
  verifyNames: (name: string) => PromiseLike<{ [t in NameTypes]: Name }>;
}

export interface AnalyticsRequests {
  sendAnalytics: (
    eventType: string,
    message: string | object | boolean,
    recordingId?: string,
    rootUrl?: string
  ) => PromiseLike<void>;
}

export interface SettingsRequests {
  saveAudioSampleRate: (rate: number) => PromiseLike<void>;
  loadAudioSampleRate: () => PromiseLike<number>;
}

type IFrontController = PublicAttributes &
  GpdbRequests &
  NamesServiceRequests &
  AnalyticsRequests &
  Partial<SettingsRequests>;

export default IFrontController;
