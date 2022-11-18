import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../../../contexts/controller";
import useTranslator from "../../../../../../../hooks/useTranslator";
import { ViewProps } from "../../types";

import styles from "../../../../../styles/outlook/styles.module.css";

const cx = classNames.bind(styles);

const OutlookView = ({
  pronunciation,
  handleOnRecorderClose,
  showRecordButton,
  onStart,
  showDeleteButton,
  onDeletePronunciation,
}: ViewProps): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);

  return (
    <>
      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        {!pronunciation && (
          <>
            <div className={styles.recorder_init_step_hint}>
              {t("recorder_init_step_hint")}
            </div>

            <div className={styles.gap_h_20} />
          </>
        )}
      </div>
      <div className={cx(styles.recorder__actions)}>
        <div className={styles.flex_column_centered}>
          {showDeleteButton && (
            <>
              <button
                className={cx(styles.margin_top_zero, styles.btn, {
                  red: true,
                })}
                onClick={onDeletePronunciation}
              >
                {t("recorder_delete_pronunciation_button_outlook")}
              </button>

              <div className={styles.gap_h_20} />
            </>
          )}

          <div className={styles.flex_row}>
            <button
              className={cx("btn", { outline: true })}
              onClick={handleOnRecorderClose}
            >
              {t("recorder_cancel_button_outlook")}
            </button>

            {showRecordButton && (
              <button className={cx("btn", { purple: true })} onClick={onStart}>
                {pronunciation
                  ? t("recorder_rerecord_button_outlook")
                  : t("recorder_start_button_outlook")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OutlookView;
