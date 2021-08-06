import React, { useContext, useEffect, useMemo, useState } from "react";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import Loader from "../Loader";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import UserResponseAction from "../Actions/UserResponse";
import { UserResponse } from "gpdb-api-client";
import ControllerContext from "../../contexts/controller";
import NameTypesFactory from "../../../types/name-types-factory";
import Select from "../Select";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  pronunciations: Pronunciation[];
  name: string;
  type: NameTypes;
  canRecord: boolean;
  canVote: boolean;
  reload: (type: NameTypes) => void;
  onRecorderClick: (name, type) => void;
}

const NameLine = (props: Props) => {
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

  const sendAnalytics = (event, index = currentIndex) =>
    controller.sendAnalytics(
      `${NameTypesFactory[props.type]}_${event}_${index}`,
      { name: props.name, type: props.type },
      currentPronunciation.id
    );

  const onSelect = ({ value }) => {
    setCurrentIndex(value);
    setAutoplay(true);
    setPronunciation(props.pronunciations[value]);
    sendAnalytics("recording_select_list_change_to", value);
  };

  const onPlayClick = () => sendAnalytics("play_button_click");

  const onUserResponse = async () => {
    const response =
      currentPronunciation?.userResponse?.response === UserResponse.Save
        ? UserResponse.Reject
        : UserResponse.Save;

    await controller.createUserResponse(currentPronunciation.id, response);
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
              autoplay={autoplay}
              onClick={onPlayClick}
            />

            {props.canRecord && (
              <RecordAction
                className={styles.pronunciation__action}
                onClick={() => props.onRecorderClick(props.name, props.type)}
              />
            )}
            {props.canVote && (
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

          {currentPronunciation.phoneticSpelling && (
            <span className={styles.pronunciation__phonetic}>
              {currentPronunciation.phoneticSpelling}
            </span>
          )}
        </>
      )}
    </div>
  );
};

NameLine.defaultProps = {
  canRecord: true,
  canVote: true,
};

export default React.memo(NameLine);
