import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../../../contexts/controller";
import useTranslator from "../../../../../../../hooks/useTranslator";
import Player from "../../../../../../Player";
import Tooltip from "../../../../../../../kit/Tooltip";
import { MAX_SAMPLE_RATE, MIN_SAMPLE_RATE } from "../../../../../constants";
import RangeInput from "../../../../RangeInput";
import Settings from "../../../../Settings";
import { StateProps } from "../../types";

import styles from "../../../../../styles/default/styles.module.css";
import useTooltip from "../../../../../../../kit/Tooltip/hooks/useTooltip";

const cx = classNames.bind(styles);

const DefaultView = ({
  slider,
  openSlider,
  closeSlider,

  onDefaultSampleRateClick,
  onUpdateSampleRate,
  onSampleRateSave,

  sampleRate,

  audioUrl,
  handleOnRecorderClose,

  onSave,
  onStart,
}: StateProps): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);
  const tooltip = useTooltip<HTMLButtonElement>();

  return (
    <>
      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        <div className={styles.inline}>
          <Player audioSrc={audioUrl} icon="playable" className="player" />
          {!slider && <Settings onClick={openSlider} active={slider} />}
        </div>
      </div>

      <div className={cx(styles.recorder__actions)}>
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

              <button onClick={closeSlider} className={styles.secondary}>
                {t("recorder_back_button_default")}
              </button>

              <div>
                <Tooltip
                  id="save_pitch_tooltip_id"
                  rightArrow
                  opener={tooltip.opener}
                  ref={tooltip.tooltipRef}
                >
                  {t("save_pitch_tooltip_text")}
                </Tooltip>
                <button 
                  ref={tooltip.openerRef}
                  onClick={onSampleRateSave}
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
      </div>
    </>
  );
};

export default DefaultView;
