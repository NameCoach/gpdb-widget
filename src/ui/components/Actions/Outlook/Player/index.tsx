import React from "react";
import Loader from "../../../Loader";
import Tooltip from "../../../../kit/Tooltip";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";
import usePlayer from "../../../../hooks/usePlayer";
import { AudioSource } from "../../../../../types/resources/pronunciation";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";

const PLAY_TOOLTIP_SIDE_OFFSET = 2;

interface Props {
  icon?: "speaker" | "playable";
  autoplay?: boolean;
  audioSrc: string;
  audioCreator?: AudioSource;
  className?: string;
  onClick?: () => void;
  tooltipId?: string;
}

let currentAudio;

const Player = ({
  autoplay,
  audioSrc,
  audioCreator,
  onClick,
  tooltipId = generateTooltipId("player"),
}: Props): JSX.Element => {
  const { speakerTip, SpeakerComponent } = useSpeakerAttrs(audioCreator);

  const { isPlaying, play, audioReady } = usePlayer({
    autoplay,
    audioCreator,
    audioSrc,
    onClick,
    currentAudio,
  });

  const tooltip = useTooltip<HTMLButtonElement>();

  return (
    <>
      {audioReady ? (
        <div>
          <Tooltip
            id={tooltipId}
            opener={tooltip.opener}
            rightArrow
            ref={tooltip.tooltipRef}
            arrowSideOffset={PLAY_TOOLTIP_SIDE_OFFSET}
          >
            {speakerTip}
          </Tooltip>
          <SpeakerComponent
            ref={tooltip.openerRef}
            onClick={play}
            iconOptions={{ playing: isPlaying }}
          />
        </div>
      ) : (
        <Loader inline sm />
      )}
    </>
  );
};

export default Player;
