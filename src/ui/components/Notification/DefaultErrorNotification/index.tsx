import React, { useContext } from "react";
import ControllerContext from "../../../contexts/controller";
import { useNotifications } from "../../../hooks/useNotification";
import useTranslator from "../../../hooks/useTranslator";
import styles from "./styles.module.css";

interface Props {
  id: number;
}

const DefaultErrorNotification = ({ id }: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const { t } = useTranslator(controller);

  const { clearNotification } = useNotifications();

  const handleOnClose = () => clearNotification(id);

  return (
    <div className={styles.container}>
      <div className={styles.centered}>
        {t("default_widget_error_msg", "Something went wrong")}
      </div>
      <i className={styles.close_icon} onClick={handleOnClose}>
        &times;
      </i>
    </div>
  );
};

export default DefaultErrorNotification;
