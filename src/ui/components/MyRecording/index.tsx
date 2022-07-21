import React, { useContext } from "react";

import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { NameOwner } from "gpdb-api-client";
import StyleContext from "../../contexts/style";
import FullNameLine from "../FullNameLine";
import ShareAudioUrlAction from "../Actions/ShareAudioUrl";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";
import useRecordingShare from "../../hooks/useRecordingShare";

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
  myInfoHintShow,
  canCreateSelfRecording,
}: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);

  const customFeatures = useCustomFeatures(null, styleContext);
  const t = useTranslator(null, styleContext);
  const [canShare, copyButtons] = useRecordingShare(
    loading,
    pronunciation,
    customFeatures
  );

  return (
    <div className={styles.block}>
      <div className={cx(styles.row)}>
        <span className={cx(styles.title, styles.m_10)}>
          {t("my_info_section_name", "My Recording")}
        </span>
        <div className={cx(styles.actions)}>
          {!loading && canShare && (
            <ShareAudioUrlAction buttons={copyButtons} />
          )}
        </div>
      </div>
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
          <div className={styles.unavailable_hint}>
            Your name recording is unavailable, click on the microphone icon to
            record your name
          </div>
        )}
    </div>
  );
};

export default MyRecording;
