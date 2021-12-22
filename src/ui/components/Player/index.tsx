import React, { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { AudioSource } from "../../../types/resources/pronunciation";

interface Props {
  icon?: "speaker" | "playable";
  autoplay?: boolean;
  audioSrc: string;
  audioCreator?: AudioSource;
  className?: string;
  onClick?: () => void;
}

const cx = classNames.bind(styles);
let currentAudio;

const speakerCssClasses = {
  default: "speaker",
  gpdb: "speaker-gpdb",
  user: "speaker-user",
  nameOwner: "speaker-name-owner",
};

const Player = (props: Props): JSX.Element => {
  const audioRef = useRef(new Audio(props.audioSrc));
  const [isPlaying, setPlaying] = useState<boolean>(false);

  const stop = (): void => setPlaying(false);
  const play = async (): Promise<void> => {
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
    return (): void => {
      audioRef.current.removeEventListener("pause", stop);
      if (currentAudio) currentAudio.removeEventListener("pause", stop);
    };
  }, []);

  const getSpeakerClassName = (audioCreator: string): string => {
    switch (audioCreator) {
      case AudioSource.Gpdb:
        return speakerCssClasses.gpdb;
      case AudioSource.NameUser:
        return speakerCssClasses.user;
      case AudioSource.NameOwner:
        return speakerCssClasses.nameOwner;
      default:
        return speakerCssClasses.default;
    }
  };

  const speakerClassName = getSpeakerClassName(props.audioCreator);

  return (
    <div
      className={cx(styles.player, props.className, {
        player__active: isPlaying,
      })}
      onClick={play}
    >
      <i className={cx(speakerClassName)} />
    </div>
  );
};

export default Player;
