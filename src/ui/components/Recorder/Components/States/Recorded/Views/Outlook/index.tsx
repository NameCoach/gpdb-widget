import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../../../contexts/controller";
import useTranslator from "../../../../../../../hooks/useTranslator";
import { MAX_SAMPLE_RATE, MIN_SAMPLE_RATE } from "../../../../../constants";
import RangeInput from "../../../../RangeInput";
import Settings from "../../../../Settings";
import { StateProps } from "../../types";

import styles from "../../../../../styles/outlook/styles.module.css";
import Player from "../../../../../../Actions/Outlook/Player";
import useTooltip from "../../../../../../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../../../../../../hooks/useSpeakerAttrs";
import Tooltip from "../../../../../../../kit/Tooltip";
import generateTooltipId from "../../../../../../../../core/utils/generate-tooltip-id";

import Analytics from "../../../../../../../../analytics";
import { useDebouncedCallback } from "use-debounce";

const cx = classNames.bind(styles);

const OutlookView = ({
  slider,
  // openSlider,
  closeSlider,
  onDefaultSampleRateClick,
  onUpdateSampleRate,
  onSampleRateSave,
  sampleRate,
  audioUrl,
  handleOnRecorderClose,
  onSave,
  onStart,
  deviceLabel,
}: StateProps): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);
  const tooltip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs();

  const onSliderRerecord = async (): Promise<void> => {
    onSampleRateSave();
    await onStart();
  };

  const onSliderCancel = (): void => {
    onDefaultSampleRateClick();
    closeSlider();
  };

  const { sendAnalyticsEvent } = Analytics.useAnalytics();

  const handleSaveButtonClick = () => {
    onSave();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Recorded.SaveRecordingButtonClick
    );
  };

  const handleRerecordButtonClick = () => {
    onStart();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Recorded.RerecordButtonClick
    );
  };

  const handleCancelButtonClick = () => {
    handleOnRecorderClose();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Recorded.CancelButtonClick
    );
  };

  const handlePreviewButtonClick = () => {
    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Recorded.PreviewButtonClick
    );
  };

  const handleDefaultButtonClick = (value) => {
    onDefaultSampleRateClick(value);

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Settings.DefaultButtonClick
    );
  };

  const handleSettingsButtonClick = () => {
    // openSlider();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Settings.ButtonClick,
      {
        options: { sampleRate, deviceLabel },
      }
    );
  };

  const handleSettingsCancelButtonClick = () => {
    onSliderCancel();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Settings.CancelButtonClick
    );
  };

  const handleSettingsRerecordButtonClicl = () => {
    onSliderRerecord();

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Settings.RerecordButtonClick,
      { options: { sampleRate, deviceLabel } }
    );
  };

  const sendAnalyticsEventPitchChange = useDebouncedCallback((value) => {
    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Recorder.Settings.PitchSliderClick,
      {
        options: { val: value, prevVal: sampleRate[0] },
      }
    );
  }, 3000);

  const handleRangeInputChange = (value) => {
    sendAnalyticsEventPitchChange.cancel();

    sendAnalyticsEventPitchChange(value[0]);

    onUpdateSampleRate(value);
  };

  return (
    <>
      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        <>
          {!slider && (
            <div className={styles.inline}>
              <div>
                <Tooltip
                  opener={tooltip.opener}
                  ref={tooltip.tooltipRef}
                  id={generateTooltipId("player")}
                >
                  {speakerTip}
                </Tooltip>
                <Player
                  onClick={handlePreviewButtonClick}
                  audioSrc={audioUrl}
                  icon="playable"
                  className="player"
                  ref={tooltip.openerRef}
                />
              </div>
            </div>
          )}

          {slider && (
            <>
              <div className={styles.slider_hint}>
                {t("recorder_slider_hint")}
              </div>

              <RangeInput
                max={MAX_SAMPLE_RATE}
                min={MIN_SAMPLE_RATE}
                values={[sampleRate]}
                onChange={handleRangeInputChange}
                onDefaultClicked={handleDefaultButtonClick}
              />
            </>
          )}
        </>
      </div>
      <div className={cx(styles.recorder__actions)}>
        <div className={styles.flex_column_centered}>
          {!slider && (
            <>
              <div className={styles.gap_h_20} />

              <button
                className={cx("btn", { red: true })}
                onClick={handleRerecordButtonClick}
              >
                {t("recorder_rerecord_button_outlook")}
              </button>
            </>
          )}

          <div className={styles.gap_h_20} />

          <div className={styles.flex_row}>
            {!slider && (
              <button
                className={cx("btn", { outline: true })}
                onClick={handleCancelButtonClick}
              >
                {t("recorder_cancel_button_outlook")}
              </button>
            )}

            {!slider && (
              <button
                className={cx("btn", { purple: true })}
                onClick={handleSaveButtonClick}
              >
                {t("recorder_save_pronunciation_button_outlook")}
              </button>
            )}

            {slider && (
              <>
                <button
                  className={cx("btn", { outline: true })}
                  onClick={handleSettingsCancelButtonClick}
                >
                  {t("recorder_cancel_button_outlook")}
                </button>

                <button
                  className={cx("btn", { purple: true })}
                  onClick={handleSettingsRerecordButtonClicl}
                >
                  {t("recorder_rerecord_button_outlook")}
                </button>
              </>
            )}
          </div>

          {!slider && (
            <>
              <div className={styles.gap_h_20} />

              <Settings onClick={handleSettingsButtonClick} active={slider} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OutlookView;
