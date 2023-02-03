import React, { useEffect, useMemo, useState } from "react";
import Pronunciation from "../../../../../types/resources/pronunciation";
import Tooltip from "../../../../kit/Tooltip";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useTranslator from "../../../../hooks/useTranslator";
import useAudio from "../../../../hooks/useAudio";
import { getSpeakerType, getTooltipText } from "./utils";
import Loader from "../../../Loader";
import { SpeakerButton, SpeakerTypes } from "../../../../kit/NewIconButtons";

interface SpeakerProps {
  pronunciation?: Pronunciation;
  type?: SpeakerTypes;
  autoplay?: boolean;
}

export const Speaker = ({
  pronunciation = null,
  type = null,
  autoplay = false,
}: SpeakerProps): JSX.Element => {
  const iconTip = useTooltip<HTMLButtonElement>();
  const { t } = useTranslator();
  const { playAudio, audioPlaying, audioReady } = useAudio({
    audioSrc: pronunciation?.audioSrc,
  });
  const [played, setPlayed] = useState<boolean>(false);

  const disabled = !pronunciation;

  const speakerType = getSpeakerType({
    relativeSource: pronunciation?.relativeSource,
    type,
    disabled,
  });
  const speakerTooltipTip = t(getTooltipText(speakerType));
  
  useEffect(() => {
    if (!audioReady) {
      setPlayed(false);
    }

    if (autoplay && audioReady && !played) {
      setPlayed(true);
      playAudio();
    }
  }, [autoplay, played, audioPlaying, audioReady]);

  return (
    <div>
      <Tooltip
        opener={iconTip.opener}
        ref={iconTip.tooltipRef}
        rightArrow
        arrowSideOffset={1}
      >
        {speakerTooltipTip}
      </Tooltip>
      {audioReady || speakerType === SpeakerTypes.Disabled ? (
        <SpeakerButton
          type={speakerType}
          onClick={playAudio}
          active={audioPlaying}
          ref={iconTip.openerRef}
          disabled={speakerType === SpeakerTypes.Disabled}
        />
      ) : (
        <Loader btn />
      )}
    </div>
  );
};
