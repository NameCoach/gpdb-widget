import { MutableRefObject, useEffect, useRef, useState } from "react";
import WavToMp3Converter from "../../core/wav-to-mp3-converter";
import userAgentManager from "../../core/userAgentManager";

type HookResult = {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  audioReady: boolean;
};

export default function useAudioRef(
  audioSrc: string,
  converter = new WavToMp3Converter()
): HookResult {
  const { isDeprecated: isOld } = userAgentManager;
  const isBlob = audioSrc.includes("blob");
  const isMp3Source = audioSrc.includes(".mp3");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    audioRef.current = null;
    setAudioReady(false);

    const convertToMp3 = async (audioSrc: string): Promise<void> => {
      try {
        const result = await fetch(audioSrc);
        const blob = await result.blob();

        converter.init(blob);
        await converter.convert();

        audioRef.current = new Audio(converter.mp3BlobUrl);
        setAudioReady(true);
      } catch (e) {
        console.log(e);
      }
    };

    // temporary solution, should be addressed in NAM-814
    if (isOld && !isBlob && !isMp3Source) convertToMp3(audioSrc);
    else {
      audioRef.current = new Audio(audioSrc);
      setAudioReady(true);
    }
  }, [audioSrc]);

  return {
    audioRef,
    audioReady,
  };
}
