import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../../../contexts/controller";
import useTranslator from "../../../../../../../hooks/useTranslator";
import { ViewProps } from "../../types";

import styles from "../../../../../styles/default/styles.module.css";

const cx = classNames.bind(styles);

const DefaultView = ({
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
        {!pronunciation && t("recorder_init_step_hint")}
      </div>
      <div className={cx(styles.recorder__actions)}>
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
      </div>
    </>
  );
};

export default DefaultView;
