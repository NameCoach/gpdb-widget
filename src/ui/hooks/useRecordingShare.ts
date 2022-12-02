import Pronunciation from "../../types/resources/pronunciation";
import { Features, FeaturesManager } from "../customFeaturesManager";

export interface ShareButton {
  text: string;
  url: string;
}

const useRecordingShare = (
  loading: boolean,
  pronunciation: Pronunciation,
  customFeatures: FeaturesManager
): [boolean, ShareButton[]] => {
  if (loading || !pronunciation) return [false, null];

  const getCopyButtons = () => {
    // eslint-disable-next-line
    const share_urls: Array<string> = customFeatures.getMetadata(Features.Share)["available_urls"];

    if (!share_urls) return;

    return share_urls
      .map((item) => {
        if (item === "defaultAudio" && pronunciation.audioSrc)
          return { url: pronunciation.audioSrc, text: "Audio" };

        if (true || item === "nameBadge" && pronunciation.nameBadgeLink) {
          return { url: pronunciation.nameBadgeLink || "string", text: "My NameBadge" };
        }
      })
      .filter((item) => item);
  };

  const copyButtons = getCopyButtons();

  const canShare =
    customFeatures.getValue(Features.Share) &&
    pronunciation &&
    copyButtons?.length > 0;

  return [canShare, copyButtons as ShareButton[]];
};

export default useRecordingShare;
