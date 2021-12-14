import React, { ReactNode, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import { NameTypes } from "../../../types/resources/name";

interface Props {
  children: ReactNode;
  name: string;
  pronunciations: Pronunciation[];
  reload: (type: NameTypes) => void;
  onRecorderClick: (name: string, type: NameTypes) => void;
  canPronunciationCreate: boolean;
  isFullName: boolean;
}

const FullName = (props: Props) => {
  const [pronunciation, setPronunciation] = useState<Pronunciation | null>();

  const onRecord = () => props.onRecorderClick(props.name, NameTypes.FullName);

  useEffect(() => {
    setPronunciation(props.pronunciations?.[0]);
  }, [props.pronunciations]);

  return (
    <div className={styles.head}>
      <div className={styles.head__names}>
        <span>{props.children}</span>
        {pronunciation?.phoneticSpelling && (
          <div className={styles.phonetic}>
            {pronunciation.phoneticSpelling}
          </div>
        )}
      </div>

      <div className={styles.head__actions}>
        {pronunciation && pronunciation.audioSrc && props.isFullName && (
          <Player
            audioSrc={pronunciation.audioSrc}
            className={nameLineStyles.pronunciation__action}
          />
        )}
        {props.canPronunciationCreate && props.isFullName && (
          <RecordAction
            className={nameLineStyles.pronunciation__action}
            onClick={onRecord}
          />
        )}
      </div>
    </div>
  );
};

export default FullName;
