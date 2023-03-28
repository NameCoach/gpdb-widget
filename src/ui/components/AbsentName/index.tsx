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
import Analytics from "../../../analytics";
import { Components } from "../../../analytics/types";
import Pronunciation from "../../../types/resources/pronunciation";

const cx = classNames.bind(nameLineStyles);

interface Props {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClick?: (
    name: string,
    type: NameTypes,
    pronunciation?: Pronunciation
  ) => void;
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

  const { sendAnalyticsEvent } = Analytics.useAnalytics();

  const handleRecordPronunciationButtonClick = () => {
    onRecorderClick && onRecorderClick(name, type);

    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Common.RecordPronunciation,
      {
        name: { value: name, type },
        component: Components.ABSENT_NAME,
      }
    );
  };

  const handleRequestPronunciationButtonClick = async () => {
    sendAnalyticsEvent(
      Analytics.AnalyticsEventTypes.Common.RequestPronunciation,
      {
        name: { value: name, type },
        component: Components.ABSENT_NAME,
      }
    );

    await onRequest();
  };

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
              nameLineStyles[`name--${theme}`],
              nameLineStyles[`pronunciations__name_absent--${theme}`]
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
            onRecordClick={handleRecordPronunciationButtonClick}
            onRequest={handleRequestPronunciationButtonClick}
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
