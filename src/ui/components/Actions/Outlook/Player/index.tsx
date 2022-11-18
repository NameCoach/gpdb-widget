import React from "react";
import Loader from "../../../Loader";
import Tooltip from "../../../Tooltip";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";
import usePlayer from "../../../../hooks/usePlayer";
import { AudioSource } from "../../../../../types/resources/pronunciation";
import generateTooltipId from "../../../../../core/utils/generate-tooltip-id";

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

  return (
    <>
      <Tooltip id={tooltipId} />

      {audioReady ? (
        <SpeakerComponent
          onClick={play}
          iconOptions={{ playing: isPlaying }}
          data-tip={speakerTip}
          data-for={tooltipId}
        />
      ) : (
        <Loader inline sm />
      )}
    </>
  );
};

export default Player;
