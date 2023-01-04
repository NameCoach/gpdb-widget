import React, { useContext } from "react";
import styles from "./styles.module.css";
import ControllerContext from "../../../../../contexts/controller";
import useTranslator from "../../../../../hooks/useTranslator";
import Loader from "../../../../Loader";
import { useRecorder } from "../../../hooks/useRecorder";

const SavedState = (): JSX.Element => {
  const controller = useContext(ControllerContext);

  const { t } = useTranslator(controller);

  const { displaySaving, saving } = useRecorder();

  return (
    <div className={styles.modal__wrapper}>
      {displaySaving &&
        (saving
          ? t("recorder_saving_pronunciation")
          : t("recorder_pronunciation_saved"))}
      <Loader inline />
    </div>
  );
};

export default SavedState;
