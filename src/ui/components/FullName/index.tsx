import React, { ReactNode, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import Pronunciation from "../../../types/resources/pronunciation";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import UserResponseAction from "../Actions/UserResponse";
import { UserResponse } from "gpdb-api-client";
import ControllerContext from "../../contexts/controller";
import { NameTypes } from "../../../types/resources/name";

interface Props {
  children: ReactNode;
  pronunciations: Pronunciation[];
  reload: (type: NameTypes) => void;
}

const FullName = (props: Props) => {
  const controller = useContext(ControllerContext);
  const [pronunciation, setPronunciation] = useState<Pronunciation | null>();

  const onUserResponse = async () => {
    const response =
      pronunciation?.userResponse?.response === UserResponse.Save
        ? UserResponse.Reject
        : UserResponse.Save;

    await controller.createUserResponse(pronunciation.id, response);
    setTimeout(() => props.reload(NameTypes.FullName), 1500);
  };

  useEffect(() => {
    setPronunciation(props.pronunciations?.[0]);
  }, [props.pronunciations]);

  return (
    <div className={styles.head}>
      <div className={styles.head__names}>{props.children}</div>

      {pronunciation?.userResponse && (
        <div className={styles.head__actions}>
          <Player
            audioSrc={pronunciation.audioSrc}
            className={nameLineStyles.pronunciation__action}
          />
          <RecordAction className={nameLineStyles.pronunciation__action} />
          <UserResponseAction
            className={nameLineStyles.pronunciation__action}
            onClick={onUserResponse}
          />
        </div>
      )}
    </div>
  );
};

export default FullName;
