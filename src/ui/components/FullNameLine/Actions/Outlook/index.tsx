import React from "react";
import ActionsPanel from "../../../../kit/ActionsPanel";
import RecordAction from "../../../Actions/Outlook/Record";
import PlayerDisabled from "../../../Actions/Outlook/PlayerDisabled";
import { Props } from "../types";
import Player from "../../../Actions/Outlook/Player";

const OutlookView = ({
  pronunciation,
  autoplay,
  showRecordAction,
  onRecorderOpen,
}: Props): JSX.Element => {
  return (
    <ActionsPanel>
      {pronunciation ? (
        <Player
          autoplay={autoplay}
          audioSrc={pronunciation.audioSrc}
          audioCreator={pronunciation.audioCreator}
        />
      ) : (
        <PlayerDisabled />
      )}

      {showRecordAction && (
        <RecordAction onClick={onRecorderOpen} rerecord={!!pronunciation} />
      )}
    </ActionsPanel>
  );
};

export default OutlookView;
