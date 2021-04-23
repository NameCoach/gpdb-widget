import Name, { NameTypes } from "./resources/name";
import Pronunciation from "./resources/pronunciation";
import { UserResponseTypes } from "./resources/user-response";

export interface Meta {
  uri?: string;
}

export interface GpdbRequests {
  complexSearch: (
    names: Array<Name>,
    meta?: Meta
  ) => PromiseLike<{ [t in NameTypes]: Pronunciation[] }>;
  simpleSearch: (name: Name, meta?: Meta) => PromiseLike<Pronunciation[]>;
  createUserResponse: (
    id: string,
    type: UserResponseTypes
  ) => PromiseLike<void>;
  createRecording: (
    name: string,
    type: NameTypes,
    audio: string
  ) => PromiseLike<void>;
  requestRecording: (name: string, type: NameTypes) => PromiseLike<void>;
}

export interface NamesServiceRequests {
  verifyNames: (name: string) => PromiseLike<{ [t in NameTypes]: Name }>;
}

export interface AnalyticsRequests {
  sendAnalytics: (
    eventType: string,
    message: string | object | boolean,
    rootUrl?: string,
    recordingId?: string
  ) => PromiseLike<void>;
}

export interface SettingsRequests {
  saveAudioSampleRate: (rate: number) => PromiseLike<void>;
  loadAudioSampleRate: () => PromiseLike<number>;
}

type IFrontController = GpdbRequests &
  NamesServiceRequests &
  AnalyticsRequests &
  Partial<SettingsRequests>;

export default IFrontController;
