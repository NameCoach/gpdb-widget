import * as React from "react";
import IFrontController from "../../../types/front-controller";
import Pronunciation from "../../../types/resources/pronunciation";
import RestorePronunciationNotification from "../../components/Notification/RestorePronunciationNotification";
import { RecorderCloseOptions } from "../../components/Recorder/types/handlers-types";
import useFeaturesManager from "../useFeaturesManager";
import { useNotifications } from "../useNotification";
import {
  ConstantOverrides,
  FeaturesManager as ICustomFeaturesManager,
} from "../../customFeaturesManager";
import { NameTypes } from "../../../types/resources/name";
import { RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY } from "../../../constants";
import SystemContext from "../../contexts/system";
import getDeleteNotificationTag from "../../../core/utils/get-delete-notification-tag";

interface Options {
  controller: IFrontController;
  customFeaturesManager: ICustomFeaturesManager;
  pronunciations: any;
  requesterPeerPronunciation: Pronunciation;
  cachedRecordingNameType: NameTypes;
  reload: (type: NameTypes) => Promise<void>;
  setLoading: (value: boolean) => void;
  setRecorderClosed: () => void;
  setPronunciations: (value: any) => void;
}

const useOnRecorderClose = ({
  controller,
  requesterPeerPronunciation,
  pronunciations,
  cachedRecordingNameType,
  customFeaturesManager,
  reload,
  setLoading,
  setRecorderClosed,
  setPronunciations,
}: Options): ((option: RecorderCloseOptions) => Promise<any>) => {
  const systemContext = React.useContext(SystemContext);
  const errorHandler = systemContext?.errorHandler;

  const autoclose = React.useMemo(() => {
    return (
      customFeaturesManager.getValue(
        ConstantOverrides.RestorePronunciationTime
      ) || RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY
    );
  }, [customFeaturesManager, controller.preferences]);

  const { setNotification } = useNotifications();

  const { can } = useFeaturesManager(
    controller.permissions,
    customFeaturesManager
  );

  const notificationTag = React.useMemo(() => {
    return getDeleteNotificationTag(cachedRecordingNameType);
  }, [cachedRecordingNameType]);

  const throwErrorNotification = () =>
    setNotification({ tag: notificationTag });

  const throwSuccessNotification = (onClick) =>
    setNotification({
      content: <RestorePronunciationNotification onClick={onClick} />,
      tag: notificationTag,
      autoclose: autoclose,
    });

  const runDelayed = React.useCallback(() => {
    try {
      const delayedDestroy = setTimeout(async () => {
        setLoading(true);
        const success = await controller.destroy(
          requesterPeerPronunciation.id,
          requesterPeerPronunciation.sourceType,
          requesterPeerPronunciation.relativeSource
        );
        setLoading(false);

        setRecorderClosed();
        await reload(cachedRecordingNameType);

        if (!success) throwErrorNotification();
      }, autoclose);

      const onRestorePronunciationClick = async (): Promise<void> => {
        clearTimeout(delayedDestroy);
        setRecorderClosed();
        await reload(cachedRecordingNameType);
      };

      const withoutCurrent = pronunciations[cachedRecordingNameType].filter(
        (n) => ![requesterPeerPronunciation].includes(n)
      );

      const newPronunciations = {
        ...pronunciations,
        [cachedRecordingNameType]: withoutCurrent,
      };

      setPronunciations(newPronunciations);

      throwSuccessNotification(onRestorePronunciationClick);

      setRecorderClosed();
    } catch (error) {
      errorHandler && errorHandler(error, "FullnamesContainer/DelayedDestroy");

      throwErrorNotification();
    }
  }, [
    autoclose,
    cachedRecordingNameType,
    controller,
    pronunciations,
    reload,
    requesterPeerPronunciation,
    setLoading,
    setNotification,
    setPronunciations,
    setRecorderClosed,
  ]);

  const runRestorable = React.useCallback(async () => {
    try {
      const success = await controller.destroy(
        requesterPeerPronunciation.id,
        requesterPeerPronunciation.sourceType,
        requesterPeerPronunciation.relativeSource
      );

      await reload(cachedRecordingNameType);
      setRecorderClosed();

      if (!success) return throwErrorNotification();

      const onRestorePronunciationClick = async (): Promise<void> => {
        const success = await controller.restore(requesterPeerPronunciation.id);
        if (success) return await reload(cachedRecordingNameType);

        throwErrorNotification();
      };

      throwSuccessNotification(onRestorePronunciationClick);
    } catch (error) {
      errorHandler &&
        errorHandler(error, "FullnamesContainer/RestorableDestroy");

      throwErrorNotification();
    }
  }, [
    autoclose,
    cachedRecordingNameType,
    controller,
    reload,
    requesterPeerPronunciation?.id,
    requesterPeerPronunciation?.relativeSource,
    requesterPeerPronunciation?.sourceType,
    setNotification,
    setRecorderClosed,
  ]);

  const onClose = React.useCallback(
    async (option: RecorderCloseOptions): Promise<void> => {
      if (option === RecorderCloseOptions.CANCEL) return setRecorderClosed();

      if (option === RecorderCloseOptions.DELETE) {
        if (can("restore", requesterPeerPronunciation))
          return await runRestorable();

        return runDelayed();
      }

      await reload(cachedRecordingNameType);
      setRecorderClosed();
    },
    [
      cachedRecordingNameType,
      can,
      reload,
      requesterPeerPronunciation,
      runDelayed,
      runRestorable,
      setRecorderClosed,
    ]
  );

  return onClose;
};

export default useOnRecorderClose;
