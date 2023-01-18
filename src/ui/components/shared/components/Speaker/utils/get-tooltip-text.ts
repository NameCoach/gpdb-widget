import { SpeakerTypes } from "../../../../../kit/Buttons/SpeakerButton";

const translationsTexts = {
  [SpeakerTypes.Peer]: "gpdb_peer_speaker_tooltip_text",
  [SpeakerTypes.Owner]: "gpdb_self_recorded_speaker_tooltip_text",
  [SpeakerTypes.Library]: "gpdb_library_speaker_tooltip_text",
  [SpeakerTypes.Default]: "default_speaker_tooltip_text",
  [SpeakerTypes.Disabled]: "player_disabled_tooltip_text",
};

export const getTooltipText = (speakerType: SpeakerTypes) => {
  return translationsTexts[speakerType];
};
