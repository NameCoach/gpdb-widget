import {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import StyleContext from "../contexts/style";
import WavToMp3Converter from "../../core/wav-to-mp3-converter";
import IWavToMp3Converter from "../../types/wav-to-mp3-converter";

type HookResult = {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  audioReady: boolean;
};

export default function useAudioRef(
  audioSrc: string,
  converter?: IWavToMp3Converter
): HookResult {
  const styleContext = useContext(StyleContext);
  const isOld = styleContext.userAgentManager.isDeprecated;

  const _converter = converter || new WavToMp3Converter();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    audioRef.current = null;
    setAudioReady(false);

    const convertToMp3 = async (audioSrc: string): Promise<void> => {
      try {
        const result = await fetch(audioSrc);
        const blob = await result.blob();

        _converter.init(blob);
        await _converter.convert();

        audioRef.current = new Audio(_converter.mp3BlobUrl);
        setAudioReady(true);
      } catch (e) {
        console.log(e);
      }
    };

    if (isOld) convertToMp3(audioSrc);
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
