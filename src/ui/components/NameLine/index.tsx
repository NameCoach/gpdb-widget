import React, { useContext, useEffect, useState } from "react";
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

interface Props {
  pronunciations: Pronunciation[];
  name: string;
  type: NameTypes;
  reload: (type: NameTypes) => void;
}

const NameLine = (props: Props) => {
  const controller = useContext(ControllerContext);
  const [currentPronunciation, setPronunciation] = useState<Pronunciation>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);

  const sendAnalytics = (event, index = currentIndex) =>
    controller.sendAnalytics(
      `${NameTypesFactory[props.type]}_${event}_${index}`,
      { name: props.name, type: props.type },
      currentPronunciation.id
    );

  const onSelect = (event) => {
    const index = event.target.value;

    setCurrentIndex(index);
    setAutoplay(true);
    setPronunciation(props.pronunciations[index]);
    sendAnalytics("recording_select_list_change_to", index);
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
    setTimeout(() => props.reload(props.type), 1000);
  };

  useEffect(() => {
    setPronunciation(props.pronunciations[0]);
  }, [props.pronunciations]);

  return (
    <div className={styles.pronunciation}>
      <span className={styles.pronunciation__name}>{props.name}</span>

      {!currentPronunciation ? (
        <Loader />
      ) : (
        <React.Fragment>
          <div className={styles.pronunciation__mid}>
            <select
              className={styles.pronunciation__control}
              onChange={onSelect}
            >
              {props.pronunciations.map((_, index) => (
                <option key={`select${index}`} value={index}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.pronunciation__actions}>
            <Player
              className={styles.pronunciation__action}
              audioSrc={currentPronunciation.audioSrc}
              autoplay={autoplay}
              onClick={onPlayClick}
            />

            <RecordAction className={styles.pronunciation__action} />
            <UserResponseAction
              className={styles.pronunciation__action}
              active={
                currentPronunciation?.userResponse?.response ===
                UserResponse.Save
              }
              onClick={onUserResponse}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default React.memo(NameLine);
