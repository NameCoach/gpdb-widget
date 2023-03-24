import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import ControllerContext from "../../../../../contexts/controller";
import useTranslator from "../../../../../hooks/useTranslator";
import Close from "../../../../Close";
import useTheme from "../../../../../hooks/useTheme";
import { Theme } from "../../../../../../types/style-context";
import { MAX_ALLOWED_FILE_SIZE } from "../../../constants";
import { useRecorder } from "../../../hooks/useRecorder";
import userAgentManager from "../../../../../../core/userAgentManager";

import styles from "./styles.module.css";
import defaultStyles from "../../../styles/default/styles.module.css";
import outlookStyles from "../../../styles/outlook/styles.module.css";

import Analytics from "../../../../../../analytics";

const cx = classNames.bind(styles);
const defaultCx = classNames.bind(defaultStyles);
const outlookCx = classNames.bind(outlookStyles);

const FailedState = (): JSX.Element => {
  const controller = useContext(ControllerContext);
  const { isDeprecated: isOld } = userAgentManager;

  const { t } = useTranslator(controller);
  const { theme } = useTheme();

  const [fileSizeError, setFileSizeError] = useState(false);

  const { onFileLoaded, handleOnRecorderClose } = useRecorder();

  const onUploaderChange = (e): void => {
    const files = e.target.files;

    if (!files || files.length === 0) return;

    if (files[0].size > MAX_ALLOWED_FILE_SIZE) return setFileSizeError(true);

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(files[0]);
    fileReader.onload = ({ target }): void => {
      onFileLoaded(target);

      setFileSizeError(false);
    };
  };

  const themeIsOutlook = theme === Theme.Outlook;
  const generalCx = themeIsOutlook ? outlookCx : defaultCx;
  const generalStyles = themeIsOutlook ? outlookStyles : defaultStyles;

  const { sendAnalyticsEvent } = Analytics.useAnalytics();

  const handleUploadButtonClick = (e) => {
    onUploaderChange(e);

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.MicrophoneUnavailable
        .UploadButtonClick
    );
  };

  useEffect(() => {
    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.MicrophoneUnavailable.Initialize
    );
  }, []);

  return (
    <>
      {theme === Theme.Default && <Close onClick={handleOnRecorderClose} />}

      <div
        className={generalCx(generalStyles.recorder__body, {
          old: isOld,
        })}
      >
        <span>{t("recorder_allow_microphone_and_try_again")}</span>

        <div className={cx(styles.uploader, { old: isOld })}>
          <div className={styles.uploader__message}>
            {t("recorder_uploader_message")}
          </div>

          <div className={styles.uploader__action}>
            <label
              htmlFor="pronunciation-upload"
              className={styles.upload__label}
            >
              {t("recorder_uploader_button")}
            </label>

            <input
              type="file"
              id="pronunciation-upload"
              name="recording"
              accept=".mp3"
              onChange={handleUploadButtonClick}
            />
          </div>
        </div>
        {fileSizeError && (
          <div className={styles.error}>
            {t("recorder_uploader_file_max_size")}
          </div>
        )}
      </div>
    </>
  );
};

export default FailedState;
