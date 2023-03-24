import { AnalyticsBrowser, Context } from "@segment/analytics-next";
import {
  AnalyticsSettings,
  GpdbUser,
  SegmentProperties,
  StartPageProperties,
} from "./types";

const analytics = new AnalyticsBrowser();

export const service = {
  isInitialized: false,
  isUserIdentified: false,
  settings: {} as Omit<AnalyticsSettings, "writeKey">,
  init: ({ writeKey, ...rest }: AnalyticsSettings): void => {
    analytics.load({ writeKey });

    service.settings = rest;
    service.isInitialized = true;
  },
  identify: (user: GpdbUser): Promise<void | Context> => {
    service.isUserIdentified = true;

    return analytics.alias(user.signature).then(() =>
      analytics.identify(user.signature, {
        name: user.fullName,
        ...user,
      })
    );
  },
  track: (event, properties): Promise<Context> => {
    const segmentProperties: SegmentProperties = {
      ...properties,
      ...service.settings,
    };

    return analytics.track(event, segmentProperties);
  },
  startPage: (props: StartPageProperties): Promise<Context> =>
    analytics.page(props),
};
