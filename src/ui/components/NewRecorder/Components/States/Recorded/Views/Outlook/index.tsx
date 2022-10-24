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

const cx = classNames.bind(styles);

const OutlookView = ({
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

  const onSliderRerecord = async (): Promise<void> => {
    onSampleRateSave();
    await onStart();
  };

  const onSliderCancel = (): void => {
    onDefaultSampleRateClick();
    closeSlider();
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
              <Player audioSrc={audioUrl} icon="playable" className="player" />
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
                onChange={onUpdateSampleRate}
                onDefaultClicked={onDefaultSampleRateClick}
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

              <button className={cx("btn", { red: true })} onClick={onStart}>
                {t("recorder_rerecord_button_outlook")}
              </button>
            </>
          )}

          <div className={styles.gap_h_20} />

          <div className={styles.flex_row}>
            {!slider && (
              <button
                className={cx("btn", { outline: true })}
                onClick={handleOnRecorderClose}
              >
                {t("recorder_cancel_button_outlook")}
              </button>
            )}

            {!slider && (
              <button className={cx("btn", { purple: true })} onClick={onSave}>
                {t("recorder_save_pronunciation_button_outlook")}
              </button>
            )}

            {slider && (
              <>
                <button
                  className={cx("btn", { outline: true })}
                  onClick={onSliderCancel}
                >
                  {t("recorder_cancel_button_outlook")}
                </button>

                <button
                  className={cx("btn", { purple: true })}
                  onClick={onSliderRerecord}
                >
                  {t("recorder_rerecord_button_outlook")}
                </button>
              </>
            )}
          </div>

          {!slider && (
            <>
              <div className={styles.gap_h_20} />

              <Settings onClick={openSlider} active={slider} />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OutlookView;
