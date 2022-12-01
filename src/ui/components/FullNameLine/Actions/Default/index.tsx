import React from "react";
import RecordAction from "../../../Actions/Record";
import Player from "../../../Player";
import DisabledPlayer from "../../../Player/Disabled";
import { Props } from "../types";
import styles from "../../styles.module.css";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";
import Tooltip from "../../../../kit/Tooltip";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";

const DefaultView = ({
  pronunciation,
  autoplay,
  showRecordAction,
  isRecorderOpen,
  onRecorderOpen,
}: Props): JSX.Element => {
  const tooltip = useTooltip<HTMLDivElement>();
  const { speakerTip } = useSpeakerAttrs(pronunciation?.audioCreator);

  return (
    <div className={styles.actions}>
      {pronunciation ? (
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
            audioSrc={pronunciation.audioSrc}
            audioCreator={pronunciation.audioCreator}
            autoplay={autoplay}
            ref={tooltip.openerRef}
          />
        </div>
      ) : (
        <DisabledPlayer />
      )}

      {showRecordAction && (
        <RecordAction
          active={isRecorderOpen}
          onClick={onRecorderOpen}
          rerecord={!!pronunciation}
        />
      )}
    </div>
  );
};

export default DefaultView;
