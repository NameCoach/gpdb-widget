import React from "react";
import ActionsPanel from "../../../../kit/ActionsPanel";
import RecordAction from "../../../Actions/Outlook/Record";
import Player from "../../../Actions/Outlook/Player";
import UserResponseAction from "../../../Actions/Outlook/UserResponse";
import { Props } from "../types";

const OutlookView = ({
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
  return (
    <ActionsPanel>
      <Player
        audioSrc={audioSrc}
        audioCreator={audioCreator}
        autoplay={autoplay}
        onClick={onPlay}
      />

      {showRecordAction && (
        <RecordAction onClick={onRecordClick} rerecord={rerecord} />
      )}

      {showUserResponseAction && (
        <UserResponseAction saved={saved} onClick={onUserResponse} />
      )}
    </ActionsPanel>
  );
};

export default OutlookView;
