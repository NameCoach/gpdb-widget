import classNames from "classnames/bind";
import React from "react";
import RecordAction from "../../../Actions/Record";
import UserResponseAction from "../../../Actions/UserResponse";
import Player from "../../../Player";
import nameLineStyles from "../../../NameLine/styles.module.css";
import userAgentManager from "../../../../../core/userAgentManager";
import useTheme from "../../../../hooks/useTheme";
import { Props } from "../types";

const cx = classNames.bind(nameLineStyles);

const DefaultView = ({
  onUserResponse,
  autoplay,
  onPlay,
  showRecordAction,
  showUserResponseAction,
  onRecordClick,
  rerecord,
  saved,
  audioSrc,
  audioCreator,
}: Props): JSX.Element => {
  const { theme } = useTheme();
  const { isDeprecated: isOld } = userAgentManager;

  return (
    <div
      className={cx(
        nameLineStyles.pronunciation__actions,
        { old_actions: isOld },
        `actions--${theme}`
      )}
    >
      <Player
        className={cx(nameLineStyles.pronunciation__action, {
          old_action: isOld,
        })}
        audioSrc={audioSrc}
        audioCreator={audioCreator}
        autoplay={autoplay}
        onClick={onPlay}
      />

      {showRecordAction && (
        <RecordAction
          className={cx(nameLineStyles.pronunciation__action, {
            old_action: isOld,
          })}
          onClick={onRecordClick}
          rerecord={rerecord}
        />
      )}
      {showUserResponseAction && (
        <UserResponseAction
          className={cx(nameLineStyles.pronunciation__action, {
            old_action: isOld,
          })}
          active={saved}
          onClick={onUserResponse}
        />
      )}
    </div>
  );
};

export default DefaultView;
