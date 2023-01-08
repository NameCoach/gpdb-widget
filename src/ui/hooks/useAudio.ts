import { MutableRefObject, useEffect, useRef, useState } from "react";
import WavToMp3Converter from "../../core/wav-to-mp3-converter";
import userAgentManager from "../../core/userAgentManager";
import IWavToMp3Converter from "../../types/wav-to-mp3-converter";

type HookResult = {
  audioRef: MutableRefObject<HTMLAudioElement | null>;
  audioReady: boolean;
  audioPlaying: boolean;
  playAudio: () => void;
  stopAudio: () => void;
};

interface HookArguments {
  audioSrc: string,
  converter?: IWavToMp3Converter,
  onError?: (e) => any,
}

const defaultErrorHandler = (e) => console.warn(e);
const defaultConverter = new WavToMp3Converter;

export default function useAudio({
  audioSrc,
  converter,
  onError,
}: HookArguments): HookResult {
  const { isDeprecated } = userAgentManager;
  const isBlob = audioSrc?.includes("blob");
  const isMp3Source = audioSrc?.includes(".mp3");

  const audioRef = useRef<HTMLAudioElement>(new Audio());
  const [audioReady, setAudioReady] = useState<boolean>(false);
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);

  const _onError = onError || defaultErrorHandler;
  const _converter = converter || defaultConverter;
  
  useEffect(() => {
    if (!audioSrc) return;
    setAudioReady(false);

    const convertToMp3 = async (audioSrc: string): Promise<string> => {
      try {
        const result = await fetch(audioSrc);
        const blob = await result.blob();

        _converter.init(blob);
        await _converter.convert();

        return _converter.mp3BlobUrl;
      } catch (e) {
        console.log(e);
      }
    };

    const setNewAudio = async (): Promise<void> => {
      let newSrc = audioSrc;

      // temporary solution, should be addressed in NAM-814
      if (isDeprecated && !isBlob && !isMp3Source)
        newSrc = await convertToMp3(audioSrc);

      audioRef.current.setAttribute("src", newSrc);
      audioRef.current.load();
    };

    setNewAudio();
  }, [audioSrc]);
  
  useEffect(() => {
    audioRef.current.onended = () => setAudioPlaying(false);
    audioRef.current.onerror = () => {
      _onError(audioRef.current.error);
      setAudioPlaying(false);
    }
    audioRef.current.onloadedmetadata = () => setAudioReady(true);
  }, []);

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;

    setAudioPlaying(false);
  }

  const playAudio = () => {
    if (!audioReady) return;

    audioRef.current.play();
    
    setAudioPlaying(true);
  };
  
  return {
    audioRef,
    audioReady,
    audioPlaying,
    playAudio,
    stopAudio
  };
}
