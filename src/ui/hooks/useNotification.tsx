import * as React from "react";
import DefaultErrorNotification from "../components/Notification/DefaultErrorNotification";

export interface AddNotification {
  id?: number;
  content: JSX.Element;
  autoclose?: number;
}

interface Notification {
  id: number;
  content: JSX.Element;
  autoclose?: number;
}

const defaultApi = {
  notifications: [] as Notification[],
  setNotification: (notification?: AddNotification) => null,
  clearNotification: (id: number) => null,
};

export type NotificationsContextValue = typeof defaultApi;

export const NotificationsContext = React.createContext<NotificationsContextValue>(
  defaultApi
);

export const NotificationsProvider = ({ children }: any): JSX.Element => {
  const [notifications, setNotifications] = React.useState<Notification[]>(
    defaultApi.notifications
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
      const id = new Date().getTime();

      const nextNotifications = notifications.concat({
        id,
        content: <DefaultErrorNotification id={notification?.id || id} />,
        ...notification,
      } as Notification);
      setNotifications(nextNotifications);
    },
    [notifications, setNotifications]
  );

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotification,
        clearNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => React.useContext(NotificationsContext);
