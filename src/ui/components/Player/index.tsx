import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

interface Props {
  icon?: "speaker" | "playable";
  autoplay?: boolean;
  audioSrc: string;
  className?: string;
  onClick?: () => void;
}

const cx = classNames.bind(styles);
let currentAudio;

const Player = (props: Props) => {
  const audioRef = useRef(new Audio(props.audioSrc));
  const [isPlaying, setPlaying] = useState<boolean>(false);

  const stop = () => setPlaying(false);
  const play = async () => {
    try {
      if (props.onClick) props.onClick();

      audioRef.current.onended = stop;

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      setPlaying(true);
      currentAudio = audioRef.current;

      await audioRef.current.play();
    } catch (e) {
      currentAudio = null;
      setPlaying(false);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio(props.audioSrc);
    if (props.autoplay) play();
  }, [props.audioSrc]);

  useEffect(() => {
    return () => {
      audioRef.current.removeEventListener("pause", stop);
      if (currentAudio) currentAudio.removeEventListener("pause", stop);
    };
  }, []);

  return (
    <div
      className={cx(styles.player, props.className, {
        player__active: isPlaying,
      })}
      onClick={play}
    >
      <i className={cx("speaker")} />
    </div>
  );
};

export default Player;
