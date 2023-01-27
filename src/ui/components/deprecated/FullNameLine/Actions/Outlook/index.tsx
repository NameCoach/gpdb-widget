import React from "react";
import ActionsPanel from "../../../../../kit/ActionsPanel";
import RecordAction from "../../../../Actions/Outlook/Record";
import { Props } from "../types";
import { Speaker } from "../../../../shared/components";


const OutlookView = ({
  pronunciation,
  autoplay,
  showRecordAction,
  onRecorderOpen,
}: Props): JSX.Element => {

  return (
    <ActionsPanel>
      {pronunciation ? (
        <Speaker autoplay={autoplay} pronunciation={pronunciation}/>
      ) : (
        <Speaker disabled />
      )}

      {showRecordAction && (
        <RecordAction onClick={onRecorderOpen} rerecord={!!pronunciation} />
      )}
    </ActionsPanel>
  );
};

export default OutlookView;
