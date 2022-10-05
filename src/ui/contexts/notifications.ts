import { createContext } from "react";
import {
  DEFAULT_API,
  NotificationsContextValue,
} from "../../types/notifications";

const NotificationsContext = createContext<NotificationsContextValue>(
  DEFAULT_API
);

export default NotificationsContext;
