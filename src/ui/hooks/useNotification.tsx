import * as React from "react";
import Children from "../../types/children-prop";
import {
  AddNotification,
  NotificationTags,
  Notification,
  DEFAULT_API,
  NotificationsContextValue,
} from "../../types/notifications";
import DefaultErrorNotification from "../components/Notification/DefaultErrorNotification";
import NotificationsContext from "../contexts/notifications";

interface NotificationsProviderProps {
  children: Children;
}

export const NotificationsProvider = ({
  children,
}: NotificationsProviderProps): JSX.Element => {
  const [notifications, setNotifications] = React.useState<Notification[]>(
    DEFAULT_API.notifications
  );

  const clearNotification = React.useCallback(
    (id: number) => {
      const nextNotifications = notifications.filter((n) => n.id !== id);
      setNotifications(nextNotifications);
    },
    [notifications, setNotifications]
  );

  const setNotification = React.useCallback(
    (notification: AddNotification) => {
      const id = notification?.id || new Date().getTime();
      const tag = notification?.tag || NotificationTags.DEFAULT;

      const content = notification.content ? (
        React.cloneElement(notification?.content, { id })
      ) : (
        <DefaultErrorNotification id={id} />
      );

      const nextNotifications = notifications.concat({
        ...notification,
        content,
        id,
        tag,
      } as Notification);
      setNotifications(nextNotifications);
    },
    [notifications, setNotifications]
  );

  const notificationsByTag = React.useCallback(
    (tag: NotificationTags) => {
      if (tag === NotificationTags.ALL) return notifications;

      return notifications.filter((notification) => notification.tag === tag);
    },
    [notifications]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotification,
        clearNotification,
        notificationsByTag,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue =>
  React.useContext(NotificationsContext);
