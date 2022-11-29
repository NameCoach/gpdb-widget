import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { AudioSource } from "../../../types/resources/pronunciation";
import Loader from "../Loader";
import Tooltip from "../../kit/Tooltip";
import useSpeakerAttrs from "../../hooks/useSpeakerAttrs";
import usePlayer from "../../hooks/usePlayer";
import generateTooltipId from "../../../core/utils/generate-tooltip-id";
import useTooltip from "../../kit/Tooltip/hooks/useTooltip";

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

const cx = classNames.bind(styles);
let currentAudio;

const Player = ({
  autoplay,
  audioSrc,
  audioCreator,
  className,
  onClick,
  tooltipId = generateTooltipId("player"),
}: Props): JSX.Element => {
  const { speakerClassName, speakerTip } = useSpeakerAttrs(audioCreator);

  const { isPlaying, play, audioReady } = usePlayer({
    autoplay,
    audioCreator,
    audioSrc,
    onClick,
    currentAudio,
  });

  const tooltip = useTooltip<HTMLDivElement>();

  return (
    <div>
      <Tooltip
        id={tooltipId}
        opener={tooltip.opener}
        ref={tooltip.tooltipRef}
        rightArrow
        arrowSideOffset={PLAY_TOOLTIP_SIDE_OFFSET}
      >
        {speakerTip}
      </Tooltip>
      <div
        className={cx(styles.player, className, {
          player__active: isPlaying,
        })}
        onClick={play}
        ref={tooltip.openerRef}
      >
        {audioReady ? (
          <i className={cx(speakerClassName)} />
        ) : (
          <Loader inline sm />
        )}
      </div>
    </div>
  );
};

export default Player;
