/* eslint-disable @typescript-eslint/no-explicit-any */

import { Context as SegmentContext } from "@segment/analytics-next";
export enum NameTypes {
  FirstName = "firstName",
  LastName = "lastName",
  FullName = "fullName",
}

export interface Name {
  value: string;
  type: NameTypes;
}

export enum GpdbUserSigTypes {
  Email = "email",
  HashedEmail = "hashed_email",
}

export interface GpdbUser {
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  signature: string;
  signatureType: GpdbUserSigTypes | "email" | "hashed_email";
}

export type ApplicationName = string;
export type SegmentWriteKey = string;
export type Pronunciation = object;
export type Block = string;
export type Component = string;
export type Origin = string;
export type Page = string;
export type User = object;
export type ExternalContext = object;
export type AnalyticsEvent = string;

export interface AnalyticsSettings {
  writeKey: SegmentWriteKey;
  applicationName: ApplicationName;
}

export interface AnalyticsSendProperties {
  page?: Page;
  name?: Name;
  me?: User;
  member?: User;
  memberGPDB?: GpdbUser;
  block?: Block;
  component?: Component;
  pronunciation?: Pronunciation;
  origin?: Origin;
  externalContext?: ExternalContext;
  options?: {
    val?: any;
    prevVal?: any;
    key?: string;
    names?: any;
    sampleRate?: number;
    deviceLabel?: string | null;
  };
}

export interface SegmentProperties extends AnalyticsSendProperties {
  applicationName: ApplicationName;
}

export interface AnalyticsProviderValue extends AnalyticsSendProperties {
  meGpdb?: GpdbUser;
}

export interface StartPageProperties {
  category?: string;
  name?: string;
  properties?: Record<string, any>;
  options?: Record<string, any>;
}

export type Context = SegmentContext;

export interface UseAnalyticsReturn {
  sendAnalyticsEvent: (
    event: AnalyticsEvent,
    properties?: AnalyticsSendProperties
  ) => Promise<Context>;
  analyticsContext: AnalyticsProviderValue;
}
