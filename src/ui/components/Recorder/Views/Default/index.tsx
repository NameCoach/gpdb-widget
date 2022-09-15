import React, { useContext } from "react";
import RangeInput from "../../Components/RangeInput";
import STATES from "../../states";
import Player from "../../../Player";
import Close from "../../../Close";
import Settings from "../../Components/Settings";
import styles from "./styles.module.css";
import ControllerContext from "../../../../contexts/controller";
import Loader from "../../../Loader";
import Tooltip from "../../../Tooltip";
import { SAVE_PITCH_TIP } from "../../../../../constants";
import classNames from "classnames/bind";
import userAgentManager from "../../../../../core/userAgentManager";
import StyleContext from "../../../../contexts/style";
import CustomAttributes from "../../../CustomAttributes";
import useTranslator from "../../../../hooks/useTranslator";
import FailedStateContainer from "../../Components/FailedStateContainer";
import {
  DEFAULT_RECORDER_INIT_STEP_HINT,
  MAX_SAMPLE_RATE,
  MIN_SAMPLE_RATE,
} from "../../constants";
import { DefaultViewProps } from "../../types/views";

const cx = classNames.bind(styles);

const DefaultView = ({
  recorderProps: {
    step,
    countdown,
    timer,
    onStart,
    onStop,
    onSave,
    handleOnRecorderClose,
    onRecorderClose,
    displaySaving,
    saving,
    showDeleteButton,
    showRecordButton,
    audioUrl,
    machineSpec,
  },
  sampleRateProps: {
    onDefaultSampleRateClick,
    onSampleRateCancel,
    onSampleRateSave,
    onUpdateSampleRate,
    sampleRate,
  },
  uploaderProps: { onUploaderChange, fileSizeError },
  termsAndConditionsProps: { termsAndConditions, onTermsAndConditionsAccept },
  sliderProps: { slider, openSlider, showSlider },
  customAttributesProps: { onCustomAttributesBack, onCustomAttributesSaved },

  owner,
  pronunciation,
  onDeletePronunciation,
}: DefaultViewProps): JSX.Element => {
  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);

  const t = useTranslator(controller, styleContext);

  const { isDeprecated: isOld } = userAgentManager;

  const recorderInitStepHint = t(
    "recorder_init_step_hint",
    DEFAULT_RECORDER_INIT_STEP_HINT
  );

  return (
    <div
      className={cx(styles.recorder, {
        old: isOld,
      })}
    >
      {[STATES.STARTED, STATES.RECORD, STATES.FAILED].includes(step) && (
        <Close onClick={handleOnRecorderClose} />
      )}

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
            <span className="flex-1">Recording...</span>
            <div className={cx(styles.recorder__timer)}>
              00:0{timer} - 00:10
            </div>
          </>
        )}

        {/* DEFAULT FLOW */}

        {step === STATES.INIT && !pronunciation && recorderInitStepHint}

        {step === STATES.RECORDED && (
          <div className={styles.inline}>
            <Player audioSrc={audioUrl} icon="playable" className="player" />
            {showSlider && <Settings onClick={openSlider} active={slider} />}
          </div>
        )}
        {/* DEFAULT FLOW ENDS */}

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

        {step === STATES.INIT && (
          <>
            <button onClick={handleOnRecorderClose}>
              {t("recorder_back_button", "BACK")}
            </button>

            {showRecordButton && (
              <button onClick={onStart}>
                {pronunciation
                  ? t("recorder_rerecord_button", "RE-RECORD")
                  : t("recorder_start_button", "START")}
              </button>
            )}

            {showDeleteButton && (
              <button onClick={onDeletePronunciation}>
                {t("delete_pronunciation_button", "DELETE PRONUNCIATION")}
              </button>
            )}
          </>
        )}

        {step === STATES.RECORD && <button onClick={onStop}>STOP</button>}

        {step === STATES.RECORDED && (
          <>
            {slider && (
              <>
                <RangeInput
                  max={MAX_SAMPLE_RATE}
                  min={MIN_SAMPLE_RATE}
                  values={[sampleRate.value]}
                  onChange={onUpdateSampleRate}
                  onDefaultClicked={onDefaultSampleRateClick}
                />

                <button
                  onClick={onSampleRateCancel}
                  className={styles.secondary}
                >
                  BACK
                </button>

                <button data-tip={SAVE_PITCH_TIP} onClick={onSampleRateSave}>
                  SAVE PITCH
                </button>

                <Tooltip
                  uuid="save_pitch_tooltip_id"
                  multiline
                  eventOff="mouseout"
                />
              </>
            )}

            {!slider && (
              <>
                <button
                  className={styles.no__border}
                  onClick={handleOnRecorderClose}
                >
                  CLOSE
                </button>
                <button onClick={onStart}>RERECORD</button>
                <button onClick={onSave}>SAVE PRONUNCIATION</button>
              </>
            )}
          </>
        )}
      </div>
      {/* RECORDER ACTIONS ENDS */}

      {/* OTHER */}
      {step === STATES.SAVED && (
        <div className={styles.modal__wrapper}>
          {displaySaving &&
            (saving ? "Saving your pronunciation" : "Pronunciation saved!")}
          <Loader inline />
        </div>
      )}

      {step === STATES.CUSTOM_ATTRS && machineSpec.canCustomAttributesCreate && (
        <>
          <CustomAttributes
            attributes={pronunciation?.customAttributes}
            disabled={false}
            saving
            noBorder
            owner={owner}
            onCustomAttributesSaved={onCustomAttributesSaved}
            onBack={onCustomAttributesBack}
            onRecorderClose={onRecorderClose}
          />
        </>
      )}
      {/* OTHER ENDS */}
    </div>
  );
};

export default DefaultView;
