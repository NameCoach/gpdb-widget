import React from "react";
import RecordAction from "../../../Actions/Record";
import Player from "../../../Player";
import DisabledPlayer from "../../../Player/Disabled";
import { Props } from "../types";
import styles from "../../styles.module.css";

const DefaultView = ({
  pronunciation,
  autoplay,
  showRecordAction,
  isRecorderOpen,
  onRecorderOpen,
}: Props): JSX.Element => {
  return (
    <div className={styles.actions}>
      {pronunciation ? (
        <Player
          audioSrc={pronunciation.audioSrc}
          audioCreator={pronunciation.audioCreator}
          autoplay={autoplay}
        />
      ) : (
        <DisabledPlayer />
      )}

      {showRecordAction && (
        <RecordAction
          active={isRecorderOpen}
          onClick={onRecorderOpen}
          rerecord={!!pronunciation}
        />
      )}
    </div>
  );
};

export default DefaultView;
