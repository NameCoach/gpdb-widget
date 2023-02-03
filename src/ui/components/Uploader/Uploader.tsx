import React, { useCallback, useState } from "react";
import { States } from "./types";
import { Failed, Initial, RecorderFailed, Uploaded } from "./states";
import { MAX_ALLOWED_FILE_SIZE } from "../Recorder/constants";
import { UploaderContext } from "./contexts/UploaderContext";

interface UploaderProps {
  onUpload: (args: { blob: Blob; audioUrl: string }) => void;
  onClose: () => void;
  onFail?: () => void;
  recorderFailed?: boolean;
}

export const Uploader = ({
  onUpload,
  onClose,
  onFail,
  recorderFailed,
}: UploaderProps) => {
  const [state, setState] = useState<States>(recorderFailed ? States.RecorderFailed :States.Initial);
  const [fileName, setFileName] = useState<string>(null);
  const [fileError, setFileError] = useState<string>(null);
  const [blob, setBlob] = useState<Blob>(null);
  const [audioUrl, setAudioUrl] = useState<string>(null);

  const upload = useCallback(
    (e: Event) => {
      setState(States.Uploaded);
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setFileName(file.name);

      if (file.size > MAX_ALLOWED_FILE_SIZE) {
        setFileError(
          "File must be less then 5MB.\nPlease choose another file."
        );
        setState(States.Failed);
        if (onFail) setTimeout(onFail, 0);
        return;
      }

      if (file.type !== "audio/mpeg") {
        setFileError(
          "File must be of '.mp3' type.\nPlease choose another file."
        );
        setState(States.Failed);
        if (onFail) setTimeout(onFail, 0);
        return;
      }

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(files[0]);
      fileReader.onload = ({ target }): void => {
        const blob = new Blob([target.result]);
        const audioUrl = URL.createObjectURL(blob);
        setBlob(blob);
        setAudioUrl(audioUrl);
        setState(States.Uploaded);
        onUpload({ blob, audioUrl });
      };
    },
    [onUpload, onFail]
  );

  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const StateComponents = {
    [States.Initial]: Initial,
    [States.Uploaded]: Uploaded,
    [States.Failed]: Failed,
    [States.RecorderFailed]: RecorderFailed,
  };

  const Component = StateComponents[state];

  const context = {
    state,
    blob,
    audioUrl,
    fileName,
    fileError,
    upload,
    close,
    setState,
  }
  
  return <UploaderContext.Provider value={context}>
    <Component />
  </UploaderContext.Provider>;
};
