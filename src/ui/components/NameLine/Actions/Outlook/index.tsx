import React from "react";
import ActionsPanel from "../../../../kit/ActionsPanel";
import RecordAction from "../../../Actions/Outlook/Record";
import Player from "../../../Actions/Outlook/Player";
import UserResponseAction from "../../../Actions/Outlook/UserResponse";
import { Props } from "../types";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";
import Tooltip from "../../../../kit/Tooltip";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";

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
  const tooltip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs(audioCreator);

  return (
    <ActionsPanel>
      <div>
        <Tooltip
          opener={tooltip.opener}
          ref={tooltip.tooltipRef}
          rightArrow
          id={generateTooltipId("player")}
        >
          {speakerTip}
        </Tooltip>
        <Player
          audioSrc={audioSrc}
          audioCreator={audioCreator}
          autoplay={autoplay}
          onClick={onPlay}
          ref={tooltip.openerRef}
        />
      </div>

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
