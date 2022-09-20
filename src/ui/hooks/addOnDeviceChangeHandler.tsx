import React, { useContext, useEffect } from "react";
import SystemContext from "../contexts/system";
import StateNotification, {
  States,
} from "../components/Notification/StateNotification";
import { useNotifications } from "./useNotification";
import { DEVICES_CHANGED_MESSAGE } from "../../constants";
import MediaDevices from "media-devices";

export default function addOnDeviceChangeHandler(): void {
  const systemContext = useContext(SystemContext);
  const logger = systemContext.logger;
  const { setNotification } = useNotifications();

  async function handleOnDeviceChange(): Promise<void> {
    const funct = MediaDevices.ondevicechange;

    if (funct) return;

    MediaDevices.ondevicechange = function (): void {
      logger.log("Hardware configuration changed!", "Gpdb-widget");

      setNotification({
        content: (
          <StateNotification
            state={States.WARNING}
            message={DEVICES_CHANGED_MESSAGE}
          />
        ),
      });
    };
  }

  useEffect(() => {
    handleOnDeviceChange();
  });
}
