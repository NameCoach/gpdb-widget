import { useContext } from "react";
import { AnalyticsContext } from "./context";
import { service } from "./service";
import {
  AnalyticsEvent,
  UseAnalyticsReturn,
  Context,
  AnalyticsSendProperties,
} from "./types";

export const useAnalytics = (): UseAnalyticsReturn => {
  const context = useContext(AnalyticsContext);

  if (!context) throw new Error("Analytics Context is not defined");

  const sendAnalyticsEvent: (
    event: AnalyticsEvent,
    properties?: AnalyticsSendProperties
  ) => Promise<Context> = (event, properties = {}) => {
    return service.track(event, {
      ...context,
      ...properties,
    });
  };

  return { sendAnalyticsEvent, analyticsContext: context };
};
