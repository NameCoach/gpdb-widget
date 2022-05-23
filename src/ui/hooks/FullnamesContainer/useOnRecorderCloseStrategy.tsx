import * as React from "react";
import IFrontController from "../../../types/front-controller";
import Pronunciation from "../../../types/resources/pronunciation";
import RestorePronunciationNotification from "../../components/Notification/RestorePronunciationNotification";
import { RecorderCloseOptions } from "../../components/Recorder/types/handlersTypes";
import useFeaturesManager from "../useFeaturesManager";
import { AddNotification } from "../useNotification";
import { FeaturesManager as ICustomFeaturesManager } from "../../customFeaturesManager";
import { NameTypes } from "../../../types/resources/name";

interface Options {
  controller: IFrontController;
  customFeaturesManager: ICustomFeaturesManager;
  pronunciations: any;
  requesterPeerPronunciation: Pronunciation;
  cachedRecordingNameType: NameTypes;
  autoclose: number;
  reload: (type: NameTypes) => Promise<void>;
  setNotification: (notification?: AddNotification) => any;
  setLoading: (value: boolean) => void;
  setRecorderClosed: () => void;
  setPronunciations: (value: any) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useOnRecorderCloseStrategy = ({
  controller,
  requesterPeerPronunciation,
  pronunciations,
  cachedRecordingNameType,
  customFeaturesManager,
  autoclose,
  reload,
  setNotification,
  setLoading,
  setRecorderClosed,
  setPronunciations,
}: Options) => {
  const { can } = useFeaturesManager(
    controller.permissions,
    customFeaturesManager
  );

  const runDelayed = React.useCallback(() => {
    const delayedDestroy = setTimeout(async () => {
      setLoading(true);
      const success = await controller.destroy(
        requesterPeerPronunciation.id,
        requesterPeerPronunciation.sourceType,
        requesterPeerPronunciation.relativeSource
      );
      setLoading(false);

      await reload(cachedRecordingNameType);
      if (success) return;
      setRecorderClosed();
      setNotification();
    }, autoclose);

    const onRestorePronunciationClick = async (): Promise<void> => {
      clearTimeout(delayedDestroy);
      setRecorderClosed();
      await reload(cachedRecordingNameType);
    };

    const notificationId = new Date().getTime();

    const withoutCurrent = pronunciations[cachedRecordingNameType].filter(
      (n) => ![requesterPeerPronunciation].includes(n)
    );

    const newPronunciations = {
      ...pronunciations,
      [cachedRecordingNameType]: withoutCurrent,
    };

    setPronunciations(newPronunciations);

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

  const runRestorable = React.useCallback(() => {
    const notificationId = new Date().getTime();

    const onRestorePronunciationClick = async (): Promise<void> => {
      const success = await controller.restore(requesterPeerPronunciation.id);
      if (success) return await reload(cachedRecordingNameType);

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
  }, [
    autoclose,
    cachedRecordingNameType,
    controller,
    reload,
    requesterPeerPronunciation?.id,
    setNotification,
  ]);

  const run = React.useCallback(
    async (option: RecorderCloseOptions) => {
      if (option === RecorderCloseOptions.CANCEL) return setRecorderClosed();

      if (
        option === RecorderCloseOptions.DELETE &&
        !can("restoreOrgPeerPronunciation")
      ) {
        return runDelayed();
      }

      await reload(cachedRecordingNameType);

      if (
        option === RecorderCloseOptions.DELETE &&
        can("restoreOrgPeerPronunciation")
      ) {
        return runRestorable();
      }

      setRecorderClosed();
    },
    [
      cachedRecordingNameType,
      can,
      reload,
      runDelayed,
      runRestorable,
      setRecorderClosed,
    ]
  );

  return run;
};

export default useOnRecorderCloseStrategy;
