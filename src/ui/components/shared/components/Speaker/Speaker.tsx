import React, { useEffect, useMemo, useState } from "react";
import Pronunciation from "../../../../../types/resources/pronunciation";
import {
  SpeakerButton,
  SpeakerTypes,
} from "../../../../kit/Buttons/SpeakerButton";
import Tooltip from "../../../../kit/Tooltip";
import useTooltip from "../../../../kit/Tooltip/hooks/useTooltip";
import useTranslator from "../../../../hooks/useTranslator";
import useAudio from "../../../../hooks/useAudio";
import { getSpeakerType, getTooltipText } from "./utils";
import Loader from "../../../Loader";

interface SpeakerProps {
  pronunciation?: Pronunciation;
  type?: SpeakerTypes;
  disabled?: boolean;
  autoplay?: boolean;
}

export const Speaker = ({
  pronunciation = null,
  type = null,
  disabled = false,
  autoplay = false,
}: SpeakerProps): JSX.Element => {
  const iconTip = useTooltip<HTMLButtonElement>();

  const { t } = useTranslator();

  const { playAudio, audioPlaying, audioReady } = useAudio({
    audioSrc: pronunciation?.audioSrc,
  });

  const [played, setPlayed] = useState<boolean>(false);

  const speakerType = useMemo(
    () =>
      getSpeakerType({
        relativeSource: pronunciation?.relativeSource,
        type,
        disabled,
      }),
    [pronunciation, type, disabled]
  );

  const speakerTooltipTip = useMemo(() => {
    return t(getTooltipText(speakerType));
  }, [speakerType]);

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
      {(audioReady || speakerType === SpeakerTypes.Disabled) ? (
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
