import { RelativeSource } from "../../../types/resources/pronunciation";

export const getLabel = (recording, t): string => {
  const labels = {
    [RelativeSource.RequesterSelf]: t(
      "requester_self_recording_label",
      "Owner Recording"
    ),
    [RelativeSource.PeerSelf]: t("peer_self_recording_label", "Peer Recording"),
    [RelativeSource.TargetSelf]: t(
      "target_self_recording_label",
      "Owner Recording"
    ),
    [RelativeSource.RequesterPeer]: t(
      "requester_peer_recording_label",
      "My Recording"
    ),
    [RelativeSource.PeerPeer]: t("peer_peer_recording_label", "Peer Recording"),
    [RelativeSource.Gpdb]:
      recording.language && recording.language !== "null"
        ? recording.language
        : t("gpdb_no_language_recording_label", "Library Recording"),
  };

  return labels[recording.relativeSource];
};
