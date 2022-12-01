import React, { useContext } from "react";
import RangeInput from "../../Components/RangeInput";
import STATES from "../../states";
import Player from "../../../Player";
import Close from "../../../Close";
import Settings from "../../Components/Settings";
import styles from "./styles.module.css";
import ControllerContext from "../../../../contexts/controller";
import Loader from "../../../Loader";
import Tooltip from "../../../../kit/Tooltip";
import classNames from "classnames/bind";
import userAgentManager from "../../../../../core/userAgentManager";
import StyleContext from "../../../../contexts/style";
import CustomAttributes from "../../../CustomAttributes";
import useTranslator from "../../../../hooks/useTranslator";
import FailedStateContainer from "../../Components/FailedStateContainer";
import { MAX_SAMPLE_RATE, MIN_SAMPLE_RATE } from "../../constants";
import { DefaultViewProps } from "../../types/views";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";

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
  const { t } = useTranslator(controller, styleContext);
  const pitchSaveTip = useTooltip<HTMLButtonElement>();
  const playerTip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs(pronunciation.audioCreator);

  const { isDeprecated: isOld } = userAgentManager;

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
            <span className="flex-1">
              {t("recorder_started_step_starts_in")}.
            </span>
            <div className={cx(styles.recorder__countdown)}>{countdown}</div>
          </>
        )}

        {step === STATES.RECORD && (
          <>
            <span className="flex-1">
              {t("recorder_record_step_recording")}
            </span>
            <div className={cx(styles.recorder__timer)}>
              00:0{timer} - 00:10
            </div>
          </>
        )}

        {/* DEFAULT FLOW */}

        {step === STATES.INIT && !pronunciation && t("recorder_init_step_hint")}

        {step === STATES.RECORDED && (
          <div className={styles.inline}>
            <div>
              <Tooltip
                opener={playerTip.opener}
                ref={playerTip.tooltipRef}
                rightArrow
                id={generateTooltipId("player")}
              >
                {speakerTip}
              </Tooltip>
              <Player
                audioSrc={audioUrl}
                icon="playable"
                className="player"
                ref={playerTip.openerRef}
              />
            </div>
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
              {t("recorder_back_button_default")}
            </button>
            <button onClick={onTermsAndConditionsAccept}>
              {t("recorder_accept_terms_and_conditions_default")}
            </button>
          </>
        )}

        {step === STATES.INIT && (
          <>
            <button onClick={handleOnRecorderClose}>
              {t("recorder_back_button_default")}
            </button>

            {showRecordButton && (
              <button onClick={onStart}>
                {pronunciation
                  ? t("recorder_rerecord_button_default")
                  : t("recorder_start_button_default")}
              </button>
            )}

            {showDeleteButton && (
              <button onClick={onDeletePronunciation}>
                {t("recorder_delete_pronunciation_button_default")}
              </button>
            )}
          </>
        )}

        {step === STATES.RECORD && (
          <button onClick={onStop}>
            {t("recorder_record_step_stop_button_default")}
          </button>
        )}

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
                  {t("recorder_back_button_default")}
                </button>

                <div>
                  <Tooltip
                    id="save_pitch_tooltip_id"
                    opener={pitchSaveTip.opener}
                    ref={pitchSaveTip.tooltipRef}
                    rightArrow
                  >
                    {t("save_pitch_tooltip_text")}
                  </Tooltip>
                  <button
                    onClick={onSampleRateSave}
                    ref={pitchSaveTip.openerRef}
                  >
                    {t("recorder_save_pitch_button")}
                  </button>
                </div>
              </>
            )}

            {!slider && (
              <>
                <button
                  className={styles.no__border}
                  onClick={handleOnRecorderClose}
                >
                  {t("recorder_close_button_default")}
                </button>
                <button onClick={onStart}>
                  {t("recorder_rerecord_button_default")}
                </button>
                <button onClick={onSave}>
                  {t("recorder_save_pronunciation_button_default")}
                </button>
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
            (saving
              ? t("recorder_saving_pronunciation")
              : t("recorder_pronunciation_saved"))}
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
