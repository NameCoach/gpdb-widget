import React from "react";
import { NotificationTags } from "../../../types/notifications";
import { useNotifications } from "../../hooks/useNotification";
import useTheme from "../../hooks/useTheme";
import styles from "./styles.module.css";

interface Props {
  tag?: NotificationTags;
}

const Notification = ({
  tag = NotificationTags.DEFAULT,
}: Props): JSX.Element => {
  const { clearNotification, notificationsByTag } = useNotifications();

  const { theme } = useTheme();

  const notifications = notificationsByTag(tag);

  return (
    <>
      {notifications.map(({ id, content, autoclose }) => {
        if (autoclose) setTimeout(() => clearNotification(id), autoclose);

        return (
          <div key={id} className={styles[theme]}>
            {content}
          </div>
        );
      })}
    </>
  );
};

export default Notification;
