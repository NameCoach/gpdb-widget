import { useCallback, useMemo } from "react";
import { AudioSource } from "../../types/resources/pronunciation";
import IconButtons, { IconButtonFC } from "../kit/IconButtons";
import useTranslator from "./useTranslator";

enum SpeakerCssClasses {
  Default = "speaker",
  Gpdb = "speaker-gpdb",
  User = "speaker-user",
  NameOwner = "speaker-name-owner",
}

interface SpeakersAttrsValue {
  className: string;
  tip: string;
  component: IconButtonFC;
};

interface HookReturn {
  speakerClassName: string;
  speakerTip: string;
  SpeakerComponent: IconButtonFC;
}

const useSpeakerAttrs = (audioCreator: AudioSource = null): HookReturn => {
  const { t } = useTranslator();
  
  const SPEAKERS_ATTRS = {
    [AudioSource.Gpdb]: {
      className: SpeakerCssClasses.Gpdb,
      tip: t("gpdb_library_speaker_tooltip_text"),
      component: IconButtons.SpeakerLibrary,
    },
    [AudioSource.NameUser]: {
      className: SpeakerCssClasses.User,
      tip: t("gpdb_peer_speaker_tooltip_text"),
      component: IconButtons.SpeakerPeer,
    },
    [AudioSource.NameOwner]: {
      className: SpeakerCssClasses.NameOwner,
      tip: t("gpdb_self_recorded_speaker_tooltip_text"),
      component: IconButtons.SpeakerOwner,
    },
    Default: {
      className: SpeakerCssClasses.Default,
      tip: t("default_speaker_tooltip_text"),
      component: IconButtons.Speaker,
    },
  };
  
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
