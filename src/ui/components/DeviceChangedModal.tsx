import React, { ReactNode, useContext, useEffect, useState } from "react";
import { Modal } from "../kit/Modals";
import MediaDevices from "media-devices";
import SystemContext from "../contexts/system";

interface DeviceChangedModal {
  children: ReactNode;
}

export const DeviceChangedModal = ({ children }: DeviceChangedModal) => {
  const systemContext = useContext(SystemContext);
  const logger = systemContext?.logger || console;

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    MediaDevices.ondevicechange = () => {
      logger.log("Hardware configuration changed!", "Gpdb-widget");

      setVisible(true);
    };

    return () => {
      MediaDevices.ondevicechange = null;
    };
  }, []);

  return (
    <Modal visible={visible} onClose={() => setVisible(false)}>
      {children}
    </Modal>
  );
};
