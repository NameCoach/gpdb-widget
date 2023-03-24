import React, { useEffect, useMemo } from "react";
import { AnalyticsContext } from "./context";
import { service } from "./service";
import { AnalyticsProviderValue, AnalyticsSettings } from "./types";

export interface ProviderProps {
  children: React.ReactNode;
  value: AnalyticsProviderValue;
  settings?: AnalyticsSettings;
}

export const Provider: React.FC<ProviderProps> = ({
  children,
  value,
  settings,
}: ProviderProps) => {
  const context = React.useContext(AnalyticsContext);

  const providerValue = useMemo(() => ({ ...context, ...value }), [
    context,
    value,
  ]);

  useEffect(() => {
    if (service.isInitialized) return;
    if (!settings)
      throw new Error(
        "settings were not defined. Analytics Service is not initialized"
      );

    service.init(settings);
  }, []);

  useEffect(() => {
    if (service.isUserIdentified || !providerValue.meGpdb) return;

    service.identify(providerValue.meGpdb);
  }, []);

  return (
    <AnalyticsContext.Provider value={providerValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};
