import React, { useContext } from "react";
import ControllerContext from "../../../../../../contexts/controller";
import useTranslator from "../../../../../../hooks/useTranslator";
import { SettingsProps } from "../../types";
import styles from "./styles.module.css";

const OutlookView = ({ onClick }: SettingsProps): JSX.Element => {
  const controller = useContext(ControllerContext);

  const { t } = useTranslator(controller);

  const options = { onClick };

  return (
    <>
      {/* <button className={styles.btn__link} {...options}> */}
      {/*  {t("recorder_settings_open")} */}
      {/* </button> */}
    </>
  );
};

export default OutlookView;
