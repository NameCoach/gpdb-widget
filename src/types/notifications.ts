export interface AddNotification {
  id?: number;
  content?: JSX.Element;
  tag?: string;
  autoclose?: number;
}

export interface Notification {
  id: number;
  content: JSX.Element;
  tag: string;
  autoclose?: number;
}

export enum NotificationTags {
  DEFAULT = "default",
  DELETE_SELF = "delete_self",
  DELETE_PEER = "delete_peer",
  // TODO: implement smth better
  DELETE_PEER_FIRSTNAME = "delete_peer_firstname",
  DELETE_PEER_LASTNAME = "delete_peer_lastname",
  DELETE_PEER_FULLNAME = "delete_peer_fullname",
  ALL = "all",
}

export const DEFAULT_API = {
  notifications: [] as Notification[],
  setNotification: (_notification?: AddNotification) => null,
  clearNotification: (_id: number) => null,
  notificationsByTag: (_tag: NotificationTags) => [] as Notification[],
};

export type NotificationsContextValue = typeof DEFAULT_API;
