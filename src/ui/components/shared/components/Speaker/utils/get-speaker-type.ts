import { RelativeSource } from "../../../../../../types/resources/pronunciation";
import { SpeakerTypes } from "../../../../../kit/NewIconButtons";

interface Props {
  relativeSource?: RelativeSource;
  disabled?: boolean;
  type?: SpeakerTypes;
}

export const getSpeakerType = ({
  relativeSource,
  disabled = false,
  type = null,
}: Props): SpeakerTypes => {
  if (disabled) return SpeakerTypes.Disabled;
  else if (type) return type;
  else if (relativeSource === RelativeSource.Gpdb) return SpeakerTypes.Library;
  else if (relativeSource === RelativeSource.PeerPeer) return SpeakerTypes.Peer;
  else if (
    relativeSource === RelativeSource.PeerSelf ||
    relativeSource === RelativeSource.TargetSelf
  )
    return SpeakerTypes.Owner;
  else if (
    relativeSource === RelativeSource.RequesterSelf ||
    relativeSource === RelativeSource.RequesterPeer
  )
    return SpeakerTypes.Owner;

  return SpeakerTypes.Default;
};
