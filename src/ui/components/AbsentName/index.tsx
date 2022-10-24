import React, { useContext } from "react";
import { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import nameLineStyles from "../NameLine/styles.module.css";
import Loader from "../Loader";
import { NameOwner } from "gpdb-api-client";
import userAgentManager from "../../../core/userAgentManager";
import StyleContext from "../../contexts/style";
import { StyleOverrides } from "../../customFeaturesManager";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../../types/style-context";
import capitalizeString from "../../../core/utils/capitalize-string";
import Actions from "./Actions";
import useRecordingRequest from "../../hooks/useRecordingRequest";

const cx = classNames.bind(nameLineStyles);

interface Props {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClick?: (name, type) => void;
  canRecordingRequestCreate: boolean;
  canRecordingRequestFind: boolean;
  canPronunciationCreate: boolean;
  isRecorderOpen?: boolean;
}

const AbsentName = ({
  name,
  type,
  owner,
  onRecorderClick,
  canPronunciationCreate,
  canRecordingRequestCreate,
  canRecordingRequestFind,
  isRecorderOpen,
}: Props): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const { customFeatures } = useContext(StyleContext);
  const { theme } = useTheme();

  const {
    loading,
    requestedMessage,
    isRequested,
    onRequest,
  } = useRecordingRequest({
    name,
    type,
    owner,
    canRecordingRequestFind,
  });

  const onRecordClick = (): void =>
    onRecorderClick && onRecorderClick(name, type);

  return (
    <div
      className={cx(
        nameLineStyles.pronunciation,
        nameLineStyles.name_line_container,
        isOld && nameLineStyles.pronunciation__old,
        { hidden: theme === Theme.Outlook ? false : isRecorderOpen }
      )}
    >
      <div
        className={cx(
          nameLineStyles.pronunciation,
          nameLineStyles[`pronunciation--${theme}`]
        )}
      >
        <div
          className={cx(
            nameLineStyles.name__wrapper,
            nameLineStyles[`wrapper--${theme}`]
          )}
        >
          <span
            className={cx(
              nameLineStyles.pronunciation__name,
              nameLineStyles[`name--${theme}`]
            )}
          >
            {capitalizeString(name)}
          </span>
        </div>
        <div
          className={cx(
            nameLineStyles.pronunciation__tail,
            nameLineStyles[`tail--${theme}`],
            isRecorderOpen && nameLineStyles.hidden
          )}
        >
          <div
            className={cx(
              nameLineStyles.pronunciation__mid,
              nameLineStyles[`mid--${theme}`]
            )}
            style={customFeatures.getStyle(
              StyleOverrides.PronunciationNameLineMessage
            )}
          >
            {!loading && requestedMessage}
            {loading && <Loader inline sm />}
          </div>

          <Actions
            onRecordClick={onRecordClick}
            onRequest={onRequest}
            showRecordAction={canPronunciationCreate}
            showRequestAction={canRecordingRequestCreate}
            disableRequestAction={isRequested}
          />
        </div>
      </div>
    </div>
  );
};

export default AbsentName;
