import classNames from "classnames/bind";
import React from "react";
import { useNotifications } from "../../../hooks/useNotification";
import styles from "./styles.module.css";

export enum States {
  WARNING = "warning",
  ALERT = "alert",
  SUCCESS = "success",
}

interface Props {
  state: States;
  id: number;
  message: string;
}

const cx = classNames.bind(styles);

const StateNotification = ({ id, state, message }: Props): JSX.Element => {
  const { clearNotification } = useNotifications();

  const handleOnClose = () => clearNotification(id);

  return (
    <div className={cx(styles.container, { [state]: true })}>
      <div className={styles.centered}>{message}</div>
      <i className={styles.close_icon} onClick={handleOnClose}>
        &times;
      </i>
    </div>
  );
};

export default StateNotification;
