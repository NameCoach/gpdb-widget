import * as React from "react";
import IFrontController from "../../../types/front-controller";
import Pronunciation from "../../../types/resources/pronunciation";
import RestorePronunciationNotification from "../../components/Notification/RestorePronunciationNotification";
import { RecorderCloseOptions } from "../../components/Recorder/types/handlersTypes";
import useFeaturesManager from "../useFeaturesManager";
import { useNotifications } from "../useNotification";
import {
  ConstantOverrides,
  FeaturesManager as ICustomFeaturesManager,
} from "../../customFeaturesManager";
import { RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY } from "../../../constants";

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
  const autoclose =
    customFeaturesManager.getValue(
      ConstantOverrides.RestorePronunciationTime
    ) || RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY;

  const { setNotification } = useNotifications();

  const { can } = useFeaturesManager(
    controller.permissions,
    customFeaturesManager
  );

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

      if (!success) setNotification();
    }, autoclose);

    const onRestorePronunciationClick = async (): Promise<void> => {
      clearTimeout(delayedDestroy);
      setRecorderClosed();
      await load();
    };

    const notificationId = new Date().getTime();

    setPronunciation(null);
    setMyInfoHintShow(true);

    setNotification({
      id: notificationId,
      content: (
        <RestorePronunciationNotification
          id={notificationId}
          onClick={onRestorePronunciationClick}
        />
      ),
      autoclose: autoclose,
    });

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

    if (!success) return setNotification();

    const notificationId = new Date().getTime();

    const onRestorePronunciationClick = async (): Promise<void> => {
      const success = await controller.restore(pronunciation.id);

      setRecorderClosed();
      await load();

      if (!success) setNotification();
    };

    setNotification({
      id: notificationId,
      content: (
        <RestorePronunciationNotification
          id={notificationId}
          onClick={onRestorePronunciationClick}
        />
      ),
      autoclose: autoclose,
    });
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
