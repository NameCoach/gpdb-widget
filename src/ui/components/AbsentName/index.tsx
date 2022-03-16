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
import userAgentManager from "../../../core/userAgentManager";
import StyleContext from "../../contexts/style";
import DisabledPlayer from "../Player/Disabled";

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
  const { isDeprecated: isOld } = userAgentManager;
  const [isRequested, setRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const { t, customFeatures } = useContext(StyleContext);

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

  const renderRequestedMessage = (): string =>
    isRequested
      ? "Pronunciation Request Pending"
      : t("pronunciations_not_available", "Pronunciations not Available");

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
      <span
        className={nameLineStyles.pronunciation__mid}
        data-pronunciation_name-line-message
        style={customFeatures.getStyle("pronunciation_name-line-message")}
      >
        {!loading && renderRequestedMessage()}
        {loading && <Loader inline sm />}
      </span>

      <div
        className={
          isOld
            ? cx(nameLineStyles.pronunciation__actions, nameLineStyles.old)
            : nameLineStyles.pronunciation__actions
        }
      >
        <DisabledPlayer />
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
