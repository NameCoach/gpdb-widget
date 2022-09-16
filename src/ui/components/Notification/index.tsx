import React from "react";
import { useNotifications } from "../../hooks/useNotification";
import styles from "./styles.module.css";

const Notification = (): JSX.Element => {
  const { notifications, clearNotification } = useNotifications();

  return (
    <>
      {notifications.map(({ id, content, autoclose }) => {
        if (autoclose) setTimeout(() => clearNotification(id), autoclose);

        return (
          <div key={id} className={styles.notification__container}>
            {content}
          </div>
        );
      })}
    </>
  );
};

export default Notification;
