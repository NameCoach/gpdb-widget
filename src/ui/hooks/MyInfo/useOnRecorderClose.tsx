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
import { RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY } from "../../../constants";
import { NotificationTags } from "../../../types/notifications";

interface Options {
  controller: IFrontController;
  customFeaturesManager: ICustomFeaturesManager;
  pronunciation: Pronunciation;
  load: () => Promise<void>;
  setLoading: (value: boolean) => void;
  setRecorderClosed: () => void;
  setPronunciation: (value: any) => void;
  setMyInfoHintShow: (value: boolean) => void;
}

const useOnRecorderClose = ({
  controller,
  pronunciation,
  customFeaturesManager,
  load,
  setLoading,
  setRecorderClosed,
  setPronunciation,
  setMyInfoHintShow,
}: Options): ((option: RecorderCloseOptions) => Promise<any>) => {
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

  const throwErrorNotification = () =>
    setNotification({ tag: NotificationTags.DELETE_SELF });

  const throwSuccessNotification = (onClick) =>
    setNotification({
      content: <RestorePronunciationNotification onClick={onClick} />,
      tag: NotificationTags.DELETE_SELF,
      autoclose: autoclose,
    });

  const runDelayed = React.useCallback(() => {
    const delayedDestroy = setTimeout(async () => {
      setLoading(true);
      const success = await controller.destroy(
        pronunciation.id,
        pronunciation.sourceType,
        pronunciation.relativeSource
      );
      setLoading(false);

      setMyInfoHintShow(true);
      setRecorderClosed();
      await load();

      if (!success) throwErrorNotification();
    }, autoclose);

    const onRestorePronunciationClick = async (): Promise<void> => {
      clearTimeout(delayedDestroy);
      setRecorderClosed();
      await load();
    };

    setPronunciation(null);
    setMyInfoHintShow(true);

    throwSuccessNotification(onRestorePronunciationClick);

    setRecorderClosed();
  }, [
    autoclose,
    controller,
    load,
    pronunciation?.id,
    pronunciation?.relativeSource,
    pronunciation?.sourceType,
    setLoading,
    setMyInfoHintShow,
    setNotification,
    setPronunciation,
    setRecorderClosed,
  ]);

  const runRestorable = React.useCallback(async () => {
    const success = await controller.destroy(
      pronunciation.id,
      pronunciation.sourceType,
      pronunciation.relativeSource
    );

    setRecorderClosed();
    await load();

    if (!success) return throwErrorNotification();

    const onRestorePronunciationClick = async (): Promise<void> => {
      const success = await controller.restore(pronunciation.id);

      setRecorderClosed();
      await load();

      if (!success) throwErrorNotification();
    };

    throwSuccessNotification(onRestorePronunciationClick);
  }, [
    autoclose,
    controller,
    load,
    pronunciation?.id,
    pronunciation?.relativeSource,
    pronunciation?.sourceType,
    setNotification,
    setRecorderClosed,
  ]);

  const onClose = React.useCallback(
    async (option: RecorderCloseOptions) => {
      setMyInfoHintShow(true);

      if (option === RecorderCloseOptions.CANCEL) return setRecorderClosed();

      if (option === RecorderCloseOptions.DELETE) {
        if (can("restore", pronunciation)) {
          if (can("customDestroy")) {
            return runDelayed();
          }

          return await runRestorable();
        }

        return runDelayed();
      }

      await load();
      setRecorderClosed();
    },
    [can, load, pronunciation, runDelayed, runRestorable, setRecorderClosed]
  );

  return onClose;
};

export default useOnRecorderClose;
