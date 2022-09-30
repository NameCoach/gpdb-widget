import Name, { NameTypes } from "./resources/name";
import Pronunciation, {
  RelativeSource,
  SourceType,
} from "./resources/pronunciation";
import {
  NameOwner,
  User,
  UserResponse,
  PermissionsManager,
  ClientPreferences,
} from "gpdb-api-client";
import NameParser from "./name-parser";
import { loadParams as permissionsLoadParams } from "gpdb-api-client/build/main/types/repositories/permissions";
import { loadParams as preferencesLoadParams } from "gpdb-api-client/build/main/types/repositories/client-side-preferences";
import { CustomAttributeObject } from "../core/mappers/custom-attributes.map";

export interface Meta {
  uri?: string;
}

export interface PublicAttributes {
  nameOwnerContext: NameOwner;
  userContext: User;
  nameParser: NameParser;
}

export interface PublicHelpers {
  isUserOwnsName: (
    nameOwnerSignature?: string
  ) => boolean
}

export interface GpdbRequests {
  permissions: PermissionsManager;
  customAttributes: CustomAttributeObject[];
  preferences: ClientPreferences;
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
  destroy: (
    id: string,
    sourceType?: SourceType,
    relativeSource?: RelativeSource
  ) => Promise<boolean>;
  restore: (id: string) => Promise<boolean>;
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
  loadPermissions: (rest?: permissionsLoadParams) => PromiseLike<void>;
  loadCustomAttributesConfig: () => PromiseLike<void>;
  loadClientPreferences: (rest?: preferencesLoadParams) => PromiseLike<void>;
}

export interface CustomAttributesRequests {
  saveCustomAttributes: (
    customAttributesValues: { [x: string]: any },
    nameOwner?: NameOwner
  ) => Promise<{ [x: string]: any }>;
}

export interface NamesServiceRequests {
  verifyNames: (name: string) => PromiseLike<{ [t in NameTypes]: Name }>;
  getSuggestions: (name: string) => PromiseLike<string[]>;
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
PublicHelpers &
  GpdbRequests &
  CustomAttributesRequests &
  NamesServiceRequests &
  AnalyticsRequests &
  Partial<SettingsRequests>;

export default IFrontController;
