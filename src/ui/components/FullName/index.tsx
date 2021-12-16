import React, { ReactNode, useEffect, useMemo, useState } from "react";
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

const FullName = (props: Props): JSX.Element => {
  const [pronunciation, setPronunciation] = useState<Pronunciation | null>();

  const onRecord = (): void =>
    props.onRecorderClick(props.name, NameTypes.FullName);

  const canCreatePronunciation = useMemo(() => {
    return (
      props.canPronunciationCreate &&
      props.isFullName &&
      !pronunciation?.nameOwnerCreated
    );
  }, [pronunciation?.nameOwnerCreated]);

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
        {canCreatePronunciation && (
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
