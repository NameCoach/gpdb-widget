import { useContext, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import SystemContext from "../contexts/system";
import useAudio from "./useAudio";

interface HookReturn {
  isPlaying: boolean;
  play: () => Promise<void>;
  audioReady: boolean;
}
const usePlayer = ({
  autoplay,
  audioSrc,
  audioCreator,
  onClick,
}): HookReturn => {
  const systemContext = useContext(SystemContext);
  const errorHandler = systemContext?.errorHandler;
  const onError = (e) => errorHandler(e, "player", { audioSrc, autoplay, audioCreator });

  const { audioReady, audioPlaying, playAudio } = useAudio({audioSrc, onError});

  const play = async (): Promise<void> => {
      if (onClick) onClick();

      await playAudio();
  };

  useEffect(() => {
    if (autoplay && audioReady) play();
  }, [audioSrc, audioReady]);

  return {isPlaying: audioPlaying, play, audioReady };
};

export default usePlayer;
