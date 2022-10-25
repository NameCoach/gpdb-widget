import React from "react";
import ActionsPanel from "../../../../kit/ActionsPanel";
import RecordAction from "../../../Actions/Outlook/Record";
import RequestAction from "../../../Actions/Outlook/Request";
import PlayerDisabled from "../../../Actions/Outlook/PlayerDisabled";
import { Props } from "../types";

const OutlookView = ({
  onRecordClick,
  showRecordAction,
  disableRequestAction,
  onRequest,
  showRequestAction,
}: Props): JSX.Element => {
  return (
    <ActionsPanel>
      <PlayerDisabled />

      {showRecordAction && (
        <RequestAction disabled={disableRequestAction} onClick={onRequest} />
      )}

      {showRequestAction && <RecordAction onClick={onRecordClick} />}
    </ActionsPanel>
  );
};

export default OutlookView;
