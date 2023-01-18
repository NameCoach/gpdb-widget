import React from "react";
import Loader from "../../../Loader";
import useSpeakerAttrs from "../../../../hooks/useSpeakerAttrs";
import usePlayer from "../../../../hooks/usePlayer";
import { AudioSource } from "../../../../../types/resources/pronunciation";


interface Props {
  icon?: "speaker" | "playable";
  autoplay?: boolean;
  audioSrc: string;
  audioCreator?: AudioSource;
  className?: string;
  onClick?: () => void;
  tooltipId?: string;
}

const Player = ({
  autoplay,
  audioSrc,
  audioCreator,
  onClick,
}: Props, ref): JSX.Element => {
  const { SpeakerComponent } = useSpeakerAttrs(audioCreator);

  const { isPlaying, play, audioReady } = usePlayer({
    autoplay,
    audioCreator,
    audioSrc,
    onClick,
  });

  return (
    <>
      {audioReady ? (
        <SpeakerComponent
          ref={ref}
          onClick={play}
          iconOptions={{ playing: isPlaying }}
        />
      ) : (
        <Loader inline sm />
      )}
    </>
  );
};

export default React.forwardRef(Player);
