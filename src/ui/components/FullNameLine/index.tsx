import React, { MouseEventHandler } from "react";

import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import DisabledPlayer from "../Player/Disabled";
import Loader from "../Loader";
import Actions from "./Actions";

export interface Props {
  fullName: string;
  pronunciation?: Pronunciation;
  showRecordAction?: boolean;
  isRecorderOpen?: boolean;
  onRecorderOpen?: MouseEventHandler;
  autoplay?: boolean;
  loading?: boolean;
}

const FullNameLine = ({
  fullName,
  pronunciation,
  showRecordAction,
  isRecorderOpen,
  onRecorderOpen,
  autoplay,
  loading,
}: Props): JSX.Element => (
  <>
    <div className={styles.container}>
      <div className={styles.name_line}>{fullName}</div>
      {loading && <Loader />}
      {!loading && !isRecorderOpen && (
        <Actions
          pronunciation={pronunciation}
          autoplay={autoplay}
          showRecordAction={showRecordAction}
          isRecorderOpen={isRecorderOpen}
          onRecorderOpen={onRecorderOpen}
        />
      )}
    </div>

    {pronunciation?.phoneticSpelling && (
      <div className={styles.phonetic}>{pronunciation.phoneticSpelling}</div>
    )}
  </>
);

export default FullNameLine;
