import React, { useContext, useEffect, useMemo, useState } from "react";
import Pronunciation from "../../../types/resources/pronunciation";
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

const cx = classNames.bind(styles);

interface Props {
  pronunciations: Pronunciation[];
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  canRecord: boolean;
  canUserResponse: boolean;
  reload: (type: NameTypes) => void;
  onRecorderClick: (name, type) => void;
}

const NameLine = (props: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const [currentPronunciation, setPronunciation] = useState<Pronunciation>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const options = useMemo(
    () =>
      props.pronunciations.map((p, i) => ({
        label: `${i + 1} - ${
          p.language && p.language !== "null" ? p.language : "My Recording"
        }`,
        value: i,
      })),
    [props.pronunciations]
  );

  const sendAnalytics = (event, index = currentIndex): PromiseLike<void> =>
    controller.sendAnalytics(
      `${NameTypesFactory[props.type]}_${event}_${index}`,
      { name: props.name, type: props.type },
      currentPronunciation.id
    );

  const onSelect = ({ value }): void => {
    setCurrentIndex(value);
    setAutoplay(true);
    setPronunciation(props.pronunciations[value]);
    sendAnalytics("recording_select_list_change_to", value);
  };

  const onPlayClick = (): PromiseLike<void> =>
    sendAnalytics("play_button_click");

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

    sendAnalytics("save_button_click");
    setPronunciation(null);
    setTimeout(() => props.reload(props.type), 1500);
  };

  useEffect(() => {
    setPronunciation(props.pronunciations[0]);
  }, [props.pronunciations]);

  return (
    <div className={cx(styles.pronunciation, "pronunciation_container")}>
      <span className={cx(styles.pronunciation__name, "pronunciation_name")}>
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
            />
            {currentPronunciation.phoneticSpelling && (
              <span className={styles.pronunciation__phonetic}>
                {currentPronunciation.phoneticSpelling}
              </span>
            )}
          </div>

          <div
            className={cx(
              styles.pronunciation__actions,
              "pronunciation_actions"
            )}
          >
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
  );
};

NameLine.defaultProps = {
  canRecord: true,
  canUserResponse: true,
};

export default React.memo(NameLine);
