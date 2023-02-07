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
      <Speaker autoplay={autoplay} pronunciation={pronunciation} />

      {showRecordAction && (
        <RecordAction onClick={onRecorderOpen} rerecord={!!pronunciation} />
      )}
    </ActionsPanel>
  );
};

export default OutlookView;
