import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import ControllerContext from "../../contexts/controller";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";

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
  const { isDeprecated: isOld } = userAgentManager;
  const controller = useContext(ControllerContext);

  const sendAnalytics = (eventType): PromiseLike<void> =>
    controller.sendAnalytics(
      eventType,
      { name: props.name, type: NameTypes.FullName },
      pronunciation.id
    );

  const onPlayClick = (): PromiseLike<void> =>
    sendAnalytics(AnalyticsEventType.Full_name_play_button_click);

  const onRecord = (): void =>
    props.onRecorderClick(props.name, NameTypes.FullName);

  useEffect(() => {
    setPronunciation(props.pronunciations?.[0]);
  }, [props.pronunciations, props.canPronunciationCreate]);

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
              onClick={onPlayClick}
              audioSrc={pronunciation.audioSrc}
              audioCreator={pronunciation.audioCreator}
              className={nameLineStyles.pronunciation__action}
            />
          )}
          {props.canPronunciationCreate && (
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
