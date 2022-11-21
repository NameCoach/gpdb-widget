import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import ControllerContext from "../contexts/controller";
import StyleContext from "../contexts/style";

const useRecordingRequest = ({
  controller = useContext(ControllerContext),
  canRecordingRequestFind,
  name,
  type,
  owner,
}) => {
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
