import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../../../contexts/controller";
import useTranslator from "../../../../../../../hooks/useTranslator";
import { StateProps } from "../../types";

import styles from "../../../../../styles/outlook/styles.module.css";

const cx = classNames.bind(styles);

const OutlookView = ({
  handleOnRecorderClose,
  countdown,
}: StateProps): JSX.Element => {
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
        <span className="flex-1">{t("recorder_started_step_starts_in")}</span>
        <div className={cx(styles.recorder__countdown)}>{countdown}</div>
      </div>

      <div className={cx(styles.recorder__actions)}>
        <div className={styles.flex_column_centered}>
          <div className={styles.gap_h_20} />

          <div className={styles.flex_row}>
            <button
              className={cx("btn", { outline: true })}
              onClick={handleOnRecorderClose}
            >
              {t("recorder_cancel_button_outlook")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OutlookView;
