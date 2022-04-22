import React, { useContext, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { AudioSource } from "../../../types/resources/pronunciation";
import useAudioRef from "../../hooks/useAudioRef";
import Loader from "../Loader";
import SystemContext from "../../contexts/system";
import Tooltip from "../Tooltip";

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

const speakerCssClasses = {
  default: "speaker",
  gpdb: "speaker-gpdb",
  user: "speaker-user",
  nameOwner: "speaker-name-owner",
};

const Player = (props: Props): JSX.Element => {
  const { audioRef, audioReady } = useAudioRef(props.audioSrc);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const systemContext = useContext(SystemContext);
  const errorHandler = systemContext?.errorHandler;
  const tooltipId = props.tooltipId || Date.now().toString();
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
      errorHandler &&
        errorHandler(e, "player", {
          audioSrc: props.audioSrc,
          autoplay: props.autoplay,
          audioCreator: props.audioCreator,
        });
      currentAudio = null;
      setPlaying(false);
    }
  };

  useEffect(() => {
    ReactTooltip.rebuild();
    if (props.autoplay && audioReady) play();
  }, [props.audioSrc, audioReady]);

  useEffect(() => {
    return (): void => {
      if (audioReady) audioRef.current.removeEventListener("pause", stop);
      if (currentAudio) currentAudio.removeEventListener("pause", stop);
    };
  }, []);

  const getSpeakerClassNameAndTip = (
    audioCreator: string
  ): { className: string; tip: string } => {
    let className, tip;
    switch (audioCreator) {
      case AudioSource.Gpdb: {
        className = speakerCssClasses.gpdb;
        tip = "This is a NameCoach<br />Library Recording";
        break;
      }
      case AudioSource.NameUser: {
        className = speakerCssClasses.user;
        tip =
          "This recording<br />is provided by a peer<br />in your organization";
        break;
      }
      case AudioSource.NameOwner: {
        className = speakerCssClasses.nameOwner;
        tip = "This is a self recorded name";
        break;
      }
      default: {
        className = speakerCssClasses.default;
        tip = "";
      }
    }

    return { className, tip };
  };

  const {
    className: speakerClassName,
    tip: speakerTip,
  } = getSpeakerClassNameAndTip(props.audioCreator);

  return (
    <div
      className={cx(styles.player, props.className, {
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
