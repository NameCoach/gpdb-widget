import React, { useContext, useEffect, useMemo, useState } from "react";
import Pronunciation, {
  RelativeSource,
} from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import Loader from "../Loader";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import UserResponseAction from "../Actions/UserResponse";
import { NameOwner, UserResponse } from "gpdb-api-client";
import ControllerContext from "../../contexts/controller";
import NameTypesFactory from "../../../types/name-types-factory";
import Select from "../Select";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import { getLabel } from "./helper-methods";
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import useTranslator from "../../hooks/useTranslator";

const cx = classNames.bind(styles);

interface Props {
  pronunciations: Pronunciation[];
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  canRecord: boolean;
  canUserResponse: boolean;
  pronunciationNameClass?: string;
  reload: (type: NameTypes) => void;
  onRecorderClick: (name, type) => void;
}

const NameLine = (props: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const t = useTranslator(controller);

  const { isDeprecated: isOld } = userAgentManager;
  const options = useMemo(
    () =>
      props.pronunciations.map((p, i) => ({
        label: `${i + 1} - ${getLabel(p, t)}`,
        value: i,
      })),
    [props.pronunciations]
  );

  const [currentPronunciation, setPronunciation] = useState<Pronunciation>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const [value, setValue] = useState(options[0]);

  const sendAnalytics = (event, index = currentIndex): PromiseLike<void> =>
    controller.sendAnalytics(
      `${NameTypesFactory[props.type]}_${event}_${index}`,
      { name: props.name, type: props.type },
      currentPronunciation.id
    );

  const onSelect = (selectedOption): void => {
    const index = selectedOption.value;

    setValue(selectedOption);
    setCurrentIndex(index);
    setAutoplay(true);
    setPronunciation(props.pronunciations[index]);
    sendAnalytics(AnalyticsEventType.Recording_select_list_change_to, index);
  };

  const onPlayClick = (): PromiseLike<void> =>
    sendAnalytics(AnalyticsEventType.Play_button_click);

  const onUserResponse = async (): Promise<void> => {
    const response =
      currentPronunciation?.userResponse?.response === UserResponse.Save
        ? UserResponse.NoOpinion
        : UserResponse.Save;

    await controller.createUserResponse(
      currentPronunciation.id,
      response,
      props.owner
    );

    sendAnalytics(AnalyticsEventType.Save_button_click);
    setPronunciation(null);
    setTimeout(() => props.reload(props.type), 1500);
  };

  const selfPronunciation = props.pronunciations.find(
    (item) => item.relativeSource === RelativeSource.RequesterPeer
  );

  useEffect(() => {
    setPronunciation(props.pronunciations[0]);
    setValue(options[0]);
  }, [props.pronunciations]);

  return (
    <div className={cx(styles.pronunciation, "name_line_container")}>
      <div className={cx(styles.pronunciation, "pronunciation_container")}>
        <span
          className={cx(
            styles.pronunciation__name,
            "pronunciation_name",
            props.pronunciationNameClass
          )}
        >
          {props.name}
        </span>

        {!currentPronunciation ? (
          <Loader />
        ) : (
          <>
            <div className={cx(styles.pronunciation__mid, "pronunciation_mid")}>
              <Select
                options={options}
                className={styles.pronunciation__control}
                onChange={onSelect}
                value={value}
              />
            </div>

            <div className={cx(styles.pronunciation__actions, { old: isOld })}>
              <Player
                className={styles.pronunciation__action}
                audioSrc={currentPronunciation.audioSrc}
                audioCreator={currentPronunciation.audioCreator}
                autoplay={autoplay}
                onClick={onPlayClick}
              />

              {props.canRecord && (
                <RecordAction
                  className={styles.pronunciation__action}
                  onClick={(): void =>
                    props.onRecorderClick(props.name, props.type)
                  }
                  rerecord={!!selfPronunciation}
                />
              )}
              {props.canUserResponse && (
                <UserResponseAction
                  className={styles.pronunciation__action}
                  active={
                    currentPronunciation?.userResponse?.response ===
                    UserResponse.Save
                  }
                  onClick={onUserResponse}
                />
              )}
            </div>
          </>
        )}
      </div>

      {currentPronunciation?.phoneticSpelling && (
        <div className={styles.phonetic}>
          {currentPronunciation.phoneticSpelling}
        </div>
      )}
    </div>
  );
};

NameLine.defaultProps = {
  canRecord: true,
  canUserResponse: true,
};

export default React.memo(NameLine);
