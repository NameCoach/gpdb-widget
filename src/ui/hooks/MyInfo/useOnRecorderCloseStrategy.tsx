import * as React from "react";
import IFrontController from "../../../types/front-controller";
import Pronunciation from "../../../types/resources/pronunciation";
import RestorePronunciationNotification from "../../components/Notification/RestorePronunciationNotification";
import { RecorderCloseOptions } from "../../components/Recorder/types/handlersTypes";
import useFeaturesManager from "../useFeaturesManager";
import { AddNotification } from "../useNotification";
import { FeaturesManager as ICustomFeaturesManager } from "../../customFeaturesManager";

interface Options {
  controller: IFrontController;
  customFeaturesManager: ICustomFeaturesManager;
  pronunciation: Pronunciation;
  autoclose: number;
  load: () => Promise<void>;
  setNotification: (notification?: AddNotification) => any;
  setLoading: (value: boolean) => void;
  setRecorderClosed: () => void;
  setPronunciation: (value: any) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useOnRecorderCloseStrategy = ({
  controller,
  pronunciation,
  customFeaturesManager,
  autoclose,
  load,
  setNotification,
  setLoading,
  setRecorderClosed,
  setPronunciation,
}: Options) => {
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

      await load();
      if (success) return;
      setRecorderClosed();
      setNotification();
    }, autoclose);

    const onRestorePronunciationClick = async (): Promise<void> => {
      clearTimeout(delayedDestroy);
      setRecorderClosed();
      await load();
    };

    const notificationId = new Date().getTime();

    setPronunciation(null);
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

    return setRecorderClosed();
  }, [
    autoclose,
    controller,
    load,
    pronunciation?.id,
    pronunciation?.relativeSource,
    pronunciation?.sourceType,
    setLoading,
    setNotification,
    setPronunciation,
    setRecorderClosed,
  ]);

  const runRestorable = React.useCallback(() => {
    const notificationId = new Date().getTime();

    const onRestorePronunciationClick = async (): Promise<void> => {
      const success = await controller.restore(pronunciation.id);
      if (success) return await load();

      setNotification();
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

    setRecorderClosed();
  }, [
    autoclose,
    controller,
    load,
    pronunciation?.id,
    setNotification,
    setRecorderClosed,
  ]);

  const run = React.useCallback(
    async (option: RecorderCloseOptions) => {
      if (option === RecorderCloseOptions.CANCEL) return setRecorderClosed();

      if (option === RecorderCloseOptions.DELETE) {
        if (can("restoreSelfPronunciation", pronunciation)) {
          if (can("customDestroy")) {
            return runDelayed();
          }

          await load();

          return runRestorable();
        }

        return runDelayed();
      }

      await load();
      setRecorderClosed();
    },
    [can, load, pronunciation, runDelayed, runRestorable, setRecorderClosed]
  );

  return run;
};

export default useOnRecorderCloseStrategy;
