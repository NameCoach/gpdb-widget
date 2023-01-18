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
import { CustomAttributeObject } from "../types/resources/custom-attribute";
export interface Meta {
  uri?: string;
}

export interface PublicAttributes {
  nameOwnerContext: NameOwner;
  userContext: User;
  nameParser: NameParser;
}

export interface PublicHelpers {
  isUserOwnsName: (nameOwnerSignature?: string) => boolean;
}

export interface GpdbRequests {
  permissions: PermissionsManager;
  customAttributes: CustomAttributeObject[];
  preferences: ClientPreferences;
  complexSearch: (
    names: Array<Omit<Name, "exist">>,
    nameOwner?: NameOwner,
    meta?: Meta
  ) => Promise<{ [t in NameTypes]: Pronunciation[] }>;
  simpleSearch: (
    name: Omit<Name, "exist">,
    nameOwner?: NameOwner,
    meta?: Meta
  ) => Promise<Pronunciation[]>;
  searchBySig: (
    nameOwner?: NameOwner
  ) => Promise<
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
  ) => Promise<void>;
  createRecording: (
    name: string,
    type: NameTypes,
    audio: string,
    owner?: NameOwner
  ) => Promise<void>;
  requestRecording: (
    name: string,
    type: NameTypes,
    nameOwner?: NameOwner
  ) => Promise<void>;
  findRecordingRequest: (
    name: string,
    type: NameTypes,
    nameOwner?: NameOwner
  ) => Promise<boolean>;
  loadPermissions: (rest?: permissionsLoadParams) => Promise<void>;
  loadCustomAttributesConfig: () => Promise<void>;
  loadClientPreferences: (rest?: preferencesLoadParams) => Promise<void>;
}

export interface CustomAttributesRequests {
  saveCustomAttributes: (
    customAttributesValues: { [x: string]: any },
    nameOwner?: NameOwner
  ) => Promise<{ [x: string]: any }>;
}

export interface NamesServiceRequests {
  verifyNames: (name: string) => Promise<{ [t in NameTypes]: Name }>;
  getSuggestions: (name: string) => Promise<string[]>;
}

export interface AnalyticsRequests {
  sendAnalytics: (
    eventType: string,
    message: string | object | boolean,
    recordingId?: string,
    rootUrl?: string
  ) => Promise<void>;
}

export interface SettingsRequests {
  saveAudioSampleRate: (rate: number) => Promise<void>;
  loadAudioSampleRate: () => Promise<number>;
}

interface PreferredRecordings {
  firstNamePronunciation: Pronunciation | null;
  lastNamePronunciation: Pronunciation | null;
}

export interface PreferredRecordingsRequests {
  getPreferredRecordings: (userContext?: User) => Promise<PreferredRecordings>;
  savePreferredRecordings: (args: PreferredRecordings) => Promise<void>;
  deletePreferredRecordings: (args: PreferredRecordings) => Promise<void>;
}

type IFrontController = PublicAttributes &
  PublicHelpers &
  GpdbRequests &
  CustomAttributesRequests &
  NamesServiceRequests &
  AnalyticsRequests &
  Partial<SettingsRequests> &
  PreferredRecordingsRequests;

export default IFrontController;
