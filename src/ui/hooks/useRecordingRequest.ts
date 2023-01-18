import { NameOwner } from "gpdb-api-client";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import IFrontController from "../../types/front-controller";
import { NameTypes } from "../../types/resources/name";
import ControllerContext from "../contexts/controller";
import StyleContext from "../contexts/style";

interface HookOptions {
  controller?: IFrontController;
  canRecordingRequestFind: boolean;
  name: string;
  type: NameTypes;
  owner: NameOwner;
}

interface HookReturn {
  onRequest: () => Promise<void>;
  isRequested: boolean;
  requestedMessage: string;
  loading: boolean;
}

const useRecordingRequest = ({
  controller = useContext(ControllerContext),
  canRecordingRequestFind,
  name,
  type,
  owner,
}: HookOptions): HookReturn => {
  const [isRequested, setRequested] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t } = useContext(StyleContext);

  const onRequest = async (): Promise<void> => {
    setLoading(true);

    await controller.requestRecording(name, type, owner);

    setRequested(true);
    setLoading(false);
  };

  const checkIfRequested = useCallback(async (): Promise<void> => {
    if (canRecordingRequestFind) {
      const result = await controller.findRecordingRequest(name, type, owner);

      setRequested(result);
    } else {
      isRequested && setRequested(false);
    }
  }, [name]);

  const requestedMessage = useMemo(() => {
    return isRequested
      ? "Pronunciation Request Pending"
      : t("pronunciations_not_available", "Pronunciations not Available");
  }, [isRequested]);

  useEffect(() => {
    checkIfRequested()
      .then(() => setLoading(false))
      .catch((e) => console.log(e));
  }, []);

  return { onRequest, isRequested, requestedMessage, loading };
};

export default useRecordingRequest;
