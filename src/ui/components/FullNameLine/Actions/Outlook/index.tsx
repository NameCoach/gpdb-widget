import React from "react";
import ActionsPanel from "../../../../kit/ActionsPanel";
import RecordAction from "../../../Actions/Outlook/Record";
import PlayerDisabled from "../../../Actions/Outlook/PlayerDisabled";
import { Props } from "../types";
import Player from "../../../Actions/Outlook/Player";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";
import Tooltip from "../../../../kit/Tooltip";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";

const TOOLTIP_SIDE_OFFSET = 0;

const OutlookView = ({
  pronunciation,
  autoplay,
  showRecordAction,
  onRecorderOpen,
}: Props): JSX.Element => {
  const tooltip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs(pronunciation?.audioCreator);

  return (
    <ActionsPanel>
      {pronunciation ? (
        <div>
          <Tooltip
            opener={tooltip.opener}
            ref={tooltip.tooltipRef}
            rightArrow
            id={generateTooltipId("player")}
            arrowSideOffset={TOOLTIP_SIDE_OFFSET}
          >
            {speakerTip}
          </Tooltip>
          <Player
            autoplay={autoplay}
            audioSrc={pronunciation.audioSrc}
            audioCreator={pronunciation.audioCreator}
            ref={tooltip.openerRef}
          />
        </div>
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
