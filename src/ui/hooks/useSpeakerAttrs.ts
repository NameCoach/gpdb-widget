import React, { useCallback, useMemo } from "react";
import { AudioSource } from "../../types/resources/pronunciation";
import IconButtons from "../kit/IconButtons";
import { IconButtonProps } from "../kit/types";

enum SpeakerCssClasses {
  Default = "speaker",
  Gpdb = "speaker-gpdb",
  User = "speaker-user",
  NameOwner = "speaker-name-owner",
}

const SPEAKERS_ATTRS = {
  [AudioSource.Gpdb]: {
    className: SpeakerCssClasses.Gpdb,
    tip: "This is a NameCoach<br />Library Recording",
    component: IconButtons.SpeakerLibrary,
  },
  [AudioSource.NameUser]: {
    className: SpeakerCssClasses.User,
    tip: "This recording<br />is provided by a peer<br />in your organization",
    component: IconButtons.SpeakerPeer,
  },
  [AudioSource.NameOwner]: {
    className: SpeakerCssClasses.NameOwner,
    tip: "This is a self recorded name",
    component: IconButtons.SpeakerOwner,
  },
  Default: {
    className: SpeakerCssClasses.Default,
    tip: "",
    component: IconButtons.Speaker,
  },
};

type SpeakersAttrsValue = typeof SPEAKERS_ATTRS.Default;

interface HookReturn {
  speakerClassName: string;
  speakerTip: string;
  SpeakerComponent: React.FC<IconButtonProps>;
}

const useSpeakerAttrs = (audioCreator: AudioSource): HookReturn => {
  const getSpeakerAttrs = useCallback(
    (audioCreator: AudioSource): SpeakersAttrsValue => {
      if (!audioCreator) return SPEAKERS_ATTRS.Default;

      return SPEAKERS_ATTRS[audioCreator];
    },
    [audioCreator]
  );

  const {
    className: speakerClassName,
    tip: speakerTip,
    component: SpeakerComponent,
  } = useMemo(() => getSpeakerAttrs(audioCreator), [audioCreator]);

  return { speakerClassName, speakerTip, SpeakerComponent };
};

export default useSpeakerAttrs;
