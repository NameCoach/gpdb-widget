import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../../../contexts/controller";
import useTranslator from "../../../../../../../hooks/useTranslator";
import Close from "../../../../../../Close";
import { StateProps } from "../../types";

import styles from "../../../../../styles/default/styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({
  handleOnRecorderClose,
  timer,
  onStop,
}: StateProps): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);

  return (
    <>
      <Close onClick={handleOnRecorderClose} />

      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        <span className="flex-1">{t("recorder_record_step_recording")}</span>
        <div className={cx(styles.recorder__timer)}>00:0{timer} - 00:10</div>
      </div>

      <div className={cx(styles.recorder__actions)}>
        <button onClick={onStop}>
          {t("recorder_record_step_stop_button_default")}
        </button>
      </div>
    </>
  );
};

export default DefaultView;
