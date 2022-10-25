import classNames from "classnames/bind";
import React from "react";
import userAgentManager from "../../../../../core/userAgentManager";
import useTheme from "../../../../hooks/useTheme";
import RecordAction from "../../../Actions/Record";
import RequestAction from "../../../Actions/Request";
import nameLineStyles from "../../../NameLine/styles.module.css";
import DisabledPlayer from "../../../Player/Disabled";
import { Props } from "../types";

const cx = classNames.bind(nameLineStyles);

const DefaultView = ({
  onRecordClick,
  showRecordAction,
  disableRequestAction,
  onRequest,
  showRequestAction,
}: Props): JSX.Element => {
  const { isDeprecated: isOld } = userAgentManager;
  const { theme } = useTheme();

  return (
    <div
      className={cx(
        nameLineStyles.pronunciation__actions,
        { old_actions: isOld },
        nameLineStyles[`actions--${theme}`]
      )}
    >
      <DisabledPlayer
        className={cx(nameLineStyles.pronunciation__action, {
          old_action: isOld,
        })}
      />
      {showRequestAction && (
        <RequestAction
          className={cx(nameLineStyles.pronunciation__action, {
            old_action: isOld,
          })}
          onClick={onRequest}
          disabled={disableRequestAction}
        />
      )}
      {showRecordAction && (
        <RecordAction
          className={cx(nameLineStyles.pronunciation__action, {
            old_action: isOld,
          })}
          onClick={onRecordClick}
        />
      )}
    </div>
  );
};

export default DefaultView;
