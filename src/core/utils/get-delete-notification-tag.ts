import { NotificationTags } from "../../types/notifications";
import { NameTypes } from "../../types/resources/name";

const getDeleteNotificationTag = (type: NameTypes): NotificationTags => {
  const tagName = (NotificationTags.DELETE_PEER + "_" + type).toUpperCase();

  return NotificationTags[tagName];
};

export default getDeleteNotificationTag;
