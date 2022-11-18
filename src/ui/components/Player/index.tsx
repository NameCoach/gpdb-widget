import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { AudioSource } from "../../../types/resources/pronunciation";
import Loader from "../Loader";
import Tooltip from "../Tooltip";
import useSpeakerAttrs from "../../hooks/useSpeakerAttrs";
import usePlayer from "../../hooks/usePlayer";
import generateTooltipId from "../../../core/utils/generate-tooltip-id";

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

  return (
    <div
      className={cx(styles.player, className, {
        player__active: isPlaying,
      })}
      onClick={play}
    >
      <Tooltip id={tooltipId} />
      {audioReady ? (
        <i
          className={cx(speakerClassName)}
          data-tip={speakerTip}
          data-for={tooltipId}
        />
      ) : (
        <Loader inline sm />
      )}
    </div>
  );
};

export default Player;
