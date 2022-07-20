import React, { useContext } from "react";

import Pronunciation from "../../../types/resources/pronunciation";
import Loader from "../Loader";
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

const MyRecording = (props: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);

  const customFeatures = useCustomFeatures(null, styleContext);
  const t = useTranslator(null, styleContext);
  const [canShare, copyButtons] = useRecordingShare(
    props.loading,
    props.pronunciation,
    customFeatures
  );

  return (
    <>
      <div className={cx(styles.row)}>
        <span className={cx(styles.title, styles.m_10)}>
          {t("my_info_section_name", "My Recording")}
        </span>
        <div className={cx(styles.actions)}>
          {!props.loading && canShare && (
            <ShareAudioUrlAction buttons={copyButtons} />
          )}
        </div>
      </div>
      {!props.loading && (
        <FullNameLine
          pronunciation={props.pronunciation}
          fullName={props.name.value}
          showRecordAction={props.showRecordAction}
          isRecorderOpen={props.isRecorderOpen}
          onRecorderOpen={props.onRecorderOpen}
        />
      )}
      {!props.loading &&
        !props.pronunciation &&
        props.canCreateSelfRecording &&
        props.myInfoHintShow && (
          <div className={styles.unavailable_hint}>
            Your name recording is unavailable, click on the microphone icon to
            record your name
          </div>
        )}
    </>
  );
};

export default MyRecording;
