import classNames from "classnames/bind";
import React, { useContext } from "react";
import userAgentManager from "../../../../../../core/userAgentManager";
import ControllerContext from "../../../../../contexts/controller";
import { useRecorder } from "../../../hooks/useRecorder";
import useTheme from "../../../../../hooks/useTheme";
import useTranslator from "../../../../../hooks/useTranslator";
import defaultStyles from "../../../styles/default/styles.module.css";
import outlookStyles from "../../../styles/outlook/styles.module.css";
import { Theme } from "../../../../../../types/style-context";

const defaultCx = classNames.bind(defaultStyles);
const outlookCx = classNames.bind(outlookStyles);

const TermsAndConditionsState = () => {
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);
  const { theme } = useTheme();

  const {
    termsAndConditions,
    onTermsAndConditionsAccept,
    handleOnRecorderClose,
  } = useRecorder();

  const themeIsOutlook = theme === Theme.Outlook;
  const styles = themeIsOutlook ? outlookStyles : defaultStyles;
  const cx = themeIsOutlook ? outlookCx : defaultCx;

  return (
    <>
      <div
        className={cx(styles.recorder__body, {
          old: isOld,
        })}
      >
        {termsAndConditions.component}
      </div>
      <div className={cx(styles.recorder__actions)}>
        <button onClick={handleOnRecorderClose}>
          {t(`recorder_back_button_${theme}`)}
        </button>
        <button onClick={onTermsAndConditionsAccept}>
          {t(`recorder_accept_terms_and_conditions_${theme}`)}
        </button>
      </div>
    </>
  );
};

export default TermsAndConditionsState;
