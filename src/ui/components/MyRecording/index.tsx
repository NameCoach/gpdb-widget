import React, { useContext } from "react";

import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../contexts/style";
import FullNameLine from "../FullNameLine";
import useTranslator from "../../hooks/useTranslator";
import ModalTooltip from "../ModalTooltip";
import Notification from "../Notification";
import { NotificationTags } from "../../../types/notifications";
import { useNotifications } from "../../hooks/useNotification";
import { PresentationMode } from "../../../types/modal-tooltip";
import ShareRecording from "../ShareRecording";

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

const MODAL_TOOLTIP_STYLE: React.CSSProperties = {
  position: "relative",
  inset: "auto auto 7px 5px",
  marginTop: "15px",
};

const MyRecording = ({
  pronunciation,
  name,
  loading,
  isRecorderOpen,
  onRecorderOpen,
  showRecordAction,
  myInfoHintShow,
  canCreateSelfRecording,
}: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(null, styleContext);
  const { notificationsByTag } = useNotifications();

  const showNotifications =
    notificationsByTag(NotificationTags.DELETE_SELF).length > 0;

  const unavailableHint = t(
    "unavailable_hint",
    "Your name recording is unavailable, click on the microphone icon to record your name"
  );

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

      <ModalTooltip
        id="fullname_tooltip"
        showOnClick={false}
        closable
        isActive={showNotifications}
        mode={PresentationMode.Left}
        tipStyle={MODAL_TOOLTIP_STYLE}
      >
        <Notification tag={NotificationTags.DELETE_SELF} />
      </ModalTooltip>

      <FullNameLine
        pronunciation={pronunciation}
        fullName={name.value}
        showRecordAction={showRecordAction}
        isRecorderOpen={isRecorderOpen}
        onRecorderOpen={onRecorderOpen}
      />
      {!loading &&
        !pronunciation &&
        canCreateSelfRecording &&
        myInfoHintShow && (
          <div className={styles.unavailable_hint}>{unavailableHint}</div>
        )}
    </div>
  );
};

export default MyRecording;
