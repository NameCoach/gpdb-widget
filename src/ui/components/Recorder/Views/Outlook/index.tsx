import React, { useContext } from "react";

import RangeInput from "../../Components/RangeInput";
import STATES from "../../states";
import Player from "../../../Player";
import Settings from "../../Components/Settings";
import styles from "./styles.module.css";
import ControllerContext from "../../../../contexts/controller";
import Loader from "../../../Loader";
import classNames from "classnames/bind";
import userAgentManager from "../../../../../core/userAgentManager";
import StyleContext from "../../../../contexts/style";
import useTranslator from "../../../../hooks/useTranslator";
import FailedStateContainer from "../../Components/FailedStateContainer";
import {
  DEFAULT_RECORDER_INIT_STEP_HINT,
  MAX_SAMPLE_RATE,
  MIN_SAMPLE_RATE,
} from "../../constants";
import { OutlookViewProps } from "../../types/views";
import { getRecordStateTitleText } from "../../../../../core/utils/get-record-state-title-text";

const DEFAULT_RECORDER_SLIDER_HINT =
  "Your browser may cause pitch issues while recording. Try adjusting the pitch slider below, then re-record with the new pitch setting.";

const cx = classNames.bind(styles);

const OutlookView = ({
  recorderProps: {
    step,
    countdown,
    timer,
    onStart,
    onStop,
    onSave,
    handleOnRecorderClose,
    displaySaving,
    saving,
    showDeleteButton,
    showRecordButton,
    audioUrl,
  },
  sampleRateProps: {
    onDefaultSampleRateClick,
    onSampleRateSave,
    onUpdateSampleRate,
    sampleRate,
  },
  uploaderProps: { onUploaderChange, fileSizeError },
  termsAndConditionsProps: { termsAndConditions, onTermsAndConditionsAccept },
  sliderProps: { closeSlider, slider, openSlider, showSlider },

  pronunciation,
  onDeletePronunciation,
  relativeSource,
}: OutlookViewProps): JSX.Element => {
  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);

  const t = useTranslator(controller, styleContext);

  const { isDeprecated: isOld } = userAgentManager;

  const statesRecordTitleText = getRecordStateTitleText(relativeSource);
  const recorderInitStepHint = t(
    "recorder_init_step_hint",
    DEFAULT_RECORDER_INIT_STEP_HINT
  );
  const sliderHint = t("recorder_slider_hint", DEFAULT_RECORDER_SLIDER_HINT);

  const onSliderRerecord = async (): Promise<void> => {
    onSampleRateSave();
    await onStart();
  };

  const onSliderCancel = (): void => {
    onDefaultSampleRateClick();
    closeSlider();
  };

  return (
    <div
      className={cx(styles.recorder, {
        old: isOld,
      })}
    >
      {/* RECORDER BODY */}
      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        {step === STATES.TERMS_AND_CONDITIONS && termsAndConditions.component}

        {step === STATES.STARTED && (
          <>
            <span className="flex-1">Recording starts in...</span>
            <div className={cx(styles.recorder__countdown)}>{countdown}</div>
          </>
        )}

        {step === STATES.RECORD && (
          <>
            <span className="flex-1">{statesRecordTitleText}</span>
            <div className={cx(styles.recorder__timer)}>
              00:0{timer} - 00:10
            </div>
          </>
        )}

        {step === STATES.INIT && !pronunciation && (
          <>
            <div className={styles.recorder_init_step_hint}>
              {recorderInitStepHint}
            </div>

            <div className={styles.gap_h_20} />
          </>
        )}

        {step === STATES.RECORDED && (
          <>
            {!slider && (
              <div className={styles.inline}>
                <Player
                  audioSrc={audioUrl}
                  icon="playable"
                  className="player"
                />
              </div>
            )}

            {slider && (
              <>
                <div className={styles.slider_hint}>{sliderHint}</div>

                <RangeInput
                  max={MAX_SAMPLE_RATE}
                  min={MIN_SAMPLE_RATE}
                  values={[sampleRate.value]}
                  onChange={onUpdateSampleRate}
                  onDefaultClicked={onDefaultSampleRateClick}
                />
              </>
            )}
          </>
        )}

        {step === STATES.FAILED && (
          <FailedStateContainer
            onUploaderChange={onUploaderChange}
            isOld={isOld}
            errors={{ fileSizeError }}
          />
        )}
      </div>
      {/* RECORDER BODY ENDS */}

      {/* RECORDER ACTIONS */}
      <div className={cx(styles.recorder__actions)}>
        {step === STATES.TERMS_AND_CONDITIONS && (
          <>
            <button onClick={handleOnRecorderClose}>
              {t("recorder_back_button", "BACK")}
            </button>
            <button onClick={onTermsAndConditionsAccept}>ACCEPT</button>
          </>
        )}

        <div className={styles.flex_column_centered}>
          {step === STATES.INIT && showDeleteButton && (
            <>
              <button
                className={cx(styles.margin_top_zero, styles.btn, {
                  red: true,
                })}
                onClick={onDeletePronunciation}
              >
                {t("delete_pronunciation_button", "Delete Recording")}
              </button>

              <div className={styles.gap_h_20} />
            </>
          )}

          {step === STATES.RECORDED && !slider && (
            <>
              <div className={styles.gap_h_20} />

              <button className={cx("btn", { red: true })} onClick={onStart}>
                Re-record
              </button>
            </>
          )}

          {[STATES.RECORD, STATES.STARTED, STATES.RECORDED].includes(step) && (
            <div className={styles.gap_h_20} />
          )}

          <div className={styles.flex_row}>
            {[
              STATES.INIT,
              STATES.RECORD,
              STATES.STARTED,
              STATES.RECORDED,
            ].includes(step) &&
              !slider && (
                <button
                  className={cx("btn", { outline: true })}
                  onClick={handleOnRecorderClose}
                >
                  {t("recorder_cancel_button", "Cancel")}
                </button>
              )}

            {step === STATES.INIT && showRecordButton && (
              <button className={cx("btn", { purple: true })} onClick={onStart}>
                {pronunciation
                  ? t("recorder_rerecord_button", "Re-record")
                  : t("recorder_start_button", "Start")}
              </button>
            )}

            {step === STATES.RECORD && (
              <button className={cx("btn", { purple: true })} onClick={onStop}>
                Stop
              </button>
            )}

            {step === STATES.RECORDED && (
              <>
                {!slider && (
                  <button
                    className={cx("btn", { purple: true })}
                    onClick={onSave}
                  >
                    Save Pronunciation
                  </button>
                )}

                {slider && (
                  <>
                    <button
                      className={cx("btn", { outline: true })}
                      onClick={onSliderCancel}
                    >
                      {t("recorder_cancel_button", "Cancel")}
                    </button>

                    <button
                      className={cx("btn", { purple: true })}
                      onClick={onSliderRerecord}
                    >
                      {t("recorder_rerecord_button", "Re-record")}
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {step === STATES.RECORDED && !slider && showSlider && (
            <>
              <div className={styles.gap_h_20} />

              <Settings onClick={openSlider} active={slider} />
            </>
          )}
        </div>
      </div>
      {/* RECORDER ACTIONS ENDS */}

      {step === STATES.SAVED && (
        <div className={styles.modal__wrapper}>
          {displaySaving &&
            (saving ? "Saving your pronunciation" : "Pronunciation saved!")}
          <Loader inline />
        </div>
      )}
    </div>
  );
};

export default OutlookView;
