import React, { useContext } from "react";

import Pronunciation from "../../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../../contexts/style";
import FullNameLine from "../FullNameLine";
import useTranslator from "../../../hooks/useTranslator";
import Notification from "../../Notification";
import { NotificationTags } from "../../../../types/notifications";
import { useNotifications } from "../../../hooks/useNotification";
import ShareRecording from "../../ShareRecording";
import usePopup from "../../../kit/Popup/hooks/usePopup";
import Popup from "../../../kit/Popup";

export interface NameOption {
  key: string;
  value: string;
  owner?: NameOwner;
}

export interface Props {
  pronunciation: Pronunciation;
  name: Omit<NameOption, "key">;
  loading: boolean;
  isRecorderOpen: boolean;
  onRecorderOpen: () => void;
  showRecordAction: boolean;
  myInfoHintShow: boolean;
  canCreateSelfRecording: boolean;
}

const cx = classNames.bind(styles);

const MyRecording = ({
  pronunciation,
  name,
  loading,
  isRecorderOpen,
  onRecorderOpen,
  showRecordAction,
}: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(null, styleContext);
  const { notificationsByTag } = useNotifications();

  const showNotifications =
    notificationsByTag(NotificationTags.DELETE_SELF).length > 0;

  const popup = usePopup<HTMLDivElement>();

  return (
    <div className={styles.block}>
      <div className={cx(styles.row)}>
        <span className={cx(styles.title, styles.m_10)}>
          {t("my_info_section_name", "My Recording")}
        </span>
        <div className={cx(styles.actions)}>
          <ShareRecording loading={loading} pronunciation={pronunciation} />
        </div>
      </div>

      <div>
        <Popup
          opener={popup.opener}
          ref={popup.popupRef}
          fullWidth
          closeable
          show={showNotifications}
        >
          <Notification tag={NotificationTags.DELETE_SELF} />
        </Popup>
        <div ref={popup.openerRef}>
          <FullNameLine
            pronunciation={pronunciation}
            fullName={name.value}
            showRecordAction={showRecordAction}
            isRecorderOpen={isRecorderOpen}
            onRecorderOpen={onRecorderOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default MyRecording;
