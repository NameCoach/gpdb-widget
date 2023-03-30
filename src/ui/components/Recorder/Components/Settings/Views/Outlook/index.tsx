import React, { useContext } from "react";
import ControllerContext from "../../../../../../contexts/controller";
import useTranslator from "../../../../../../hooks/useTranslator";
import { Row } from "../../../../../../kit/Grid";
import { Check } from "../../../../../../kit/NewIcons";
import { StyledText } from "../../../../../../kit/Topography";
import Loader from "../../../../../Loader";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const OutlookView = ({
  onClick,
  loading,
  isAnalyticsUserReportSend,
}: SettingsProps): JSX.Element => {
  const controller = useContext(ControllerContext);

  const { t } = useTranslator(controller);

  const options = { onClick };

  return (
    <Row>
      {!loading && !isAnalyticsUserReportSend && (
        <button className={styles.btn__link} {...options}>
          {t("recorder_settings_open")}
        </button>
      )}
      {loading && (
        <Row centered gap={8}>
          <Loader btn />
          <StyledText>{t("recorder_settings_process")}</StyledText>
        </Row>
      )}
      {isAnalyticsUserReportSend && (
        <Row centered gap={8}>
          <Check />
          <StyledText>{t("recorder_settings_finished")}</StyledText>
        </Row>
      )}
    </Row>
  );
};

export default OutlookView;
