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
  countdown,
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
        <>
          <span className="flex-1">
            {t("recorder_started_step_starts_in")}.
          </span>
          <div className={cx(styles.recorder__countdown)}>{countdown}</div>
        </>
      </div>
    </>
  );
};

export default DefaultView;
