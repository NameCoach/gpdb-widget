import classNames from "classnames/bind";
import React, { useContext, useEffect, useRef } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import { RelativeSource } from "../../../../../../../../types/resources/pronunciation";
import ControllerContext from "../../../../../../../contexts/controller";
import { useRecorder } from "../../../../../hooks/useRecorder";
import useTranslator from "../../../../../../../hooks/useTranslator";
import { InboundRelativeSource } from "../../../../../types/inbound-relative-source";
import { StateProps } from "../../types";
import Analytics from "../../../../../../../../analytics";

import styles from "../../../../../styles/outlook/styles.module.css";

const cx = classNames.bind(styles);

const OutlookView = ({
  handleOnRecorderClose,
  timer,
  onStop,
}: StateProps): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);

  const { relativeSource } = useRecorder();

  const getTitle = (
    relativeSource: InboundRelativeSource,
    name?: string
  ): string => {
    if (name) return `${t("recorder_pronounce")} ${name}`;

    if (relativeSource === RelativeSource.RequesterSelf)
      return t("recorder_pronounce_your_name");

    return t("recorder_record_step_recording");
  };

  const title = getTitle(relativeSource);

  const { sendAnalyticsEvent } = Analytics.useAnalytics();
  const handleStopbuttonClick = () => {
    onStop();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Recording.StopButtonClick
    );
  };

  const handleCancelButtonClick = () => {
    handleOnRecorderClose();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Recording.CancelButtonClick
    );
  };

  const initializeRef = useRef(false);

  useEffect(() => {
    if (initializeRef.current === false) {
      sendAnalyticsEvent(
        Analytics.AnalyticsEventTypes.Recorder.Recording.Initialize
      );

      initializeRef.current = true;
    }
  }, []);

  return (
    <>
      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        <span className="flex-1">{title}</span>
        <div className={cx(styles.recorder__timer)}>00:0{timer} - 00:10</div>
      </div>
      <div className={cx(styles.recorder__actions)}>
        <div className={styles.flex_column_centered}>
          <div className={styles.gap_h_20} />

          <div className={styles.flex_row}>
            <button
              className={cx("btn", { outline: true })}
              onClick={handleCancelButtonClick}
            >
              {t("recorder_cancel_button_outlook")}
            </button>

            <button
              className={cx("btn", { purple: true })}
              onClick={handleStopbuttonClick}
            >
              {t("recorder_record_step_stop_button_outlook")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OutlookView;
