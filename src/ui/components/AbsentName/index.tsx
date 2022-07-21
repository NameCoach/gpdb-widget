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
import { StyleOverrides } from "../../customFeaturesManager";
import useTheme from "../../hooks/useTheme";

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
  const { theme } = useTheme();

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
  }, [props.name]);

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
        styles[`pronunciation__not_exist--${theme}`],
        nameLineStyles.pronunciation,
        nameLineStyles[`pronunciation--${theme}`]
      )}
    >
      <span
        className={cx(
          nameLineStyles.pronunciation__name,
          nameLineStyles[`name--${theme}`]
        )}
      >
        {props.name}
      </span>
      <div className={cx(nameLineStyles.pronunciation__tail)}>
        <span
          className={cx(
            nameLineStyles.pronunciation__mid,
            nameLineStyles[`mid--${theme}`]
          )}
          style={customFeatures.getStyle(
            StyleOverrides.PronunciationNameLineMessage
          )}
        >
          {!loading && renderRequestedMessage()}
          {loading && <Loader inline sm />}
        </span>

        <div
          className={
            isOld
              ? cx(
                  nameLineStyles.pronunciation__actions,
                  nameLineStyles.old,
                  nameLineStyles[`actions--${theme}`]
                )
              : cx(
                  nameLineStyles.pronunciation__actions,
                  nameLineStyles[`actions--${theme}`]
                )
          }
        >
          <DisabledPlayer className={nameLineStyles.pronunciation__action} />
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
    </div>
  );
};

export default AbsentName;
