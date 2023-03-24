import { createContext } from "react";
import { AnalyticsProviderValue } from "./types";

const defaultApi = null as AnalyticsProviderValue;

export const AnalyticsContext = createContext<AnalyticsProviderValue>(
  defaultApi
);
