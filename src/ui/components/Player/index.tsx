import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { AudioSource } from "../../../types/resources/pronunciation";
import Loader from "../Loader";
import useSpeakerAttrs from "../../hooks/useSpeakerAttrs";
import usePlayer from "../../hooks/usePlayer";

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

const Player = ({
  autoplay,
  audioSrc,
  audioCreator,
  className,
  onClick,
}: Props, ref): JSX.Element => {
  const { speakerClassName } = useSpeakerAttrs(audioCreator);

  const { isPlaying, play, audioReady } = usePlayer({
    autoplay,
    audioCreator,
    audioSrc,
    onClick,
  });

  return (
    <div
      className={cx(styles.player, className, {
        player__active: isPlaying,
      })}
      onClick={play}
      ref={ref}
    >
      {audioReady ? (
        <i className={cx(speakerClassName)} />
      ) : (
        <Loader inline sm />
      )}
    </div>
  );
};

export default React.forwardRef(Player);
