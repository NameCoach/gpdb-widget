import React, { ReactNode, useContext, useEffect, useMemo, useState } from "react";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import { NameTypes } from "../../../types/resources/name";
import StyleContext from "../../contexts/style";
import classNames from "classnames/bind";

const cx = classNames.bind([styles, nameLineStyles]);

interface Props {
  children: ReactNode;
  name: string;
  pronunciations: Pronunciation[];
  reload: (type: NameTypes) => void;
  onRecorderClick: (name: string, type: NameTypes) => void;
  canPronunciationCreate: boolean;
}

const FullName = (props: Props): JSX.Element => {
  const [pronunciation, setPronunciation] = useState<Pronunciation | null>();
  const styleContext = useContext(StyleContext);
  const isOld = styleContext.userAgentManager.isDeprecated;

  const onRecord = (): void =>
    props.onRecorderClick(props.name, NameTypes.FullName);

  const canCreatePronunciation = useMemo(() => {
    return pronunciation
      ? !pronunciation?.isHedb
      : props.canPronunciationCreate;
  }, [pronunciation?.isHedb]);

  useEffect(() => {
    setPronunciation(props.pronunciations?.[0]);
  }, [props.pronunciations]);

  return (
    <div className={styles.head__container}>
      <div className={styles.head}>
        <div className={styles.head__names}>
          <span>{props.children}</span>
        </div>

        <div
          className={
            isOld ? cx(styles.head__actions, styles.old) : styles.head__actions
          }
        >
          {pronunciation && pronunciation.audioSrc && (
            <Player
              audioSrc={pronunciation.audioSrc}
              audioCreator={pronunciation.audioCreator}
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

      {pronunciation?.phoneticSpelling && (
        <div className={styles.phonetic}>{pronunciation.phoneticSpelling}</div>
      )}
    </div>
  );
};

export default FullName;
