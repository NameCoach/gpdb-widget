import React, { MouseEventHandler } from "react";

import Pronunciation from "../../../types/resources/pronunciation";
import styles from "./styles.module.css";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import DisabledPlayer from "../Player/Disabled";
import Loader from "../Loader";

export interface Props {
  fullName: string;
  pronunciation?: Pronunciation;
  showRecordAction?: boolean;
  isRecorderOpen?: boolean;
  onRecorderOpen?: MouseEventHandler;
  autoplay?: boolean;
  loading?: boolean;
}

const FullNameLine = (props: Props): JSX.Element => (
  <>
    <div className={styles.container}>
      <div className={styles.name_line}>{props.fullName}</div>
      {props.loading && <Loader />}
      {!props.loading && !props.isRecorderOpen && (
        <div className={styles.actions}>
          {props.pronunciation ? (
            <Player
              audioSrc={props.pronunciation.audioSrc}
              audioCreator={props.pronunciation.audioCreator}
              autoplay={props.autoplay}
            />
          ) : (
            <DisabledPlayer />
          )}
          {props.showRecordAction && (
            <RecordAction
              active={props.isRecorderOpen}
              onClick={props.onRecorderOpen}
              rerecord={!!props.pronunciation}
            />
          )}
        </div>
      )}
    </div>
    {props.pronunciation && (
      <div className={styles.phonetic}>
        {props.pronunciation.phoneticSpelling}
      </div>
    )}
  </>
);

export default FullNameLine;
