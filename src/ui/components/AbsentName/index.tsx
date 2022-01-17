import React, { useCallback, useContext, useEffect, useState } from "react";
import { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import nameLineStyles from "../NameLine/styles.module.css";
import RequestAction from "../Actions/Request";
import RecordAction from "../Actions/Record";
import ControllerContext from "../../contexts/controller";
import Loader from "../Loader";
import { NameOwner } from "gpdb-api-client";

const cx = classNames.bind([styles, nameLineStyles]);

interface Props {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClick?: (name, type) => void;
  canRecordingRequestCreate: boolean;
  canRecordingRequestFind: boolean;
  canPronunciationCreate: boolean;
}

const AbsentName = (props: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const [isRequested, setRequest] = useState(false);
  const [loading, setLoading] = useState(true);

  const onRequest = async (): Promise<void> => {
    setLoading(true);
    await controller.requestRecording(props.name, props.type, props.owner);
    setRequest(true);
    setLoading(false);
  };

  const checkIfRequested = useCallback(async (): Promise<void> => {
    if (props.canRecordingRequestFind) {
      const result = await controller.findRecordingRequest(
        props.name,
        props.type,
        props.owner
      );

      setRequest(result);
    } else {
      isRequested && setRequest(false);
    }
  }, [name]);

  const renderRequestedMessage = () =>
    isRequested
      ? "pronunciation request pending"
      : "pronunciations not available";

  useEffect(() => {
    checkIfRequested()
      .then(() => setLoading(false))
      .catch((e) => console.log(e));
  }, []);

  return (
    <div
      className={cx(
        styles.pronunciation__not_exist,
        nameLineStyles.pronunciation
      )}
    >
      <span
        className={cx(
          nameLineStyles.pronunciation__name,
          styles.name__not_exist
        )}
      >
        {props.name}
      </span>
      <span className={nameLineStyles.pronunciation__mid}>
        {!loading && renderRequestedMessage()}
        {loading && <Loader inline sm />}
      </span>

      <div className={nameLineStyles.pronunciation__actions}>
        {props.canRecordingRequestCreate && (
          <RequestAction
            className={nameLineStyles.pronunciation__action}
            onClick={onRequest}
            disabled={isRequested}
          />
        )}
        {props.canPronunciationCreate && (
          <RecordAction
            className={nameLineStyles.pronunciation__action}
            onClick={(): void =>
              props.onRecorderClick &&
              props.onRecorderClick(props.name, props.type)
            }
          />
        )}
      </div>
    </div>
  );
};

export default AbsentName;
