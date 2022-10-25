import { useContext, useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import SystemContext from "../contexts/system";
import useAudioRef from "./useAudioRef";

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
  currentAudio,
}): HookReturn => {
  const { audioRef, audioReady } = useAudioRef(audioSrc);
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const systemContext = useContext(SystemContext);
  const errorHandler = systemContext?.errorHandler;

  const stop = (): void => setPlaying(false);

  const play = async (): Promise<void> => {
    try {
      if (onClick) onClick();

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
          audioSrc: audioSrc,
          autoplay: autoplay,
          audioCreator: audioCreator,
        });
      currentAudio = null;
      setPlaying(false);
    }
  };

  useEffect(() => {
    ReactTooltip.rebuild();
    if (autoplay && audioReady) play();
  }, [audioSrc, audioReady]);

  useEffect(() => {
    return (): void => {
      if (audioReady) audioRef.current.removeEventListener("pause", stop);
      if (currentAudio) currentAudio.removeEventListener("pause", stop);
    };
  }, []);

  return { isPlaying, play, audioReady };
};

export default usePlayer;
