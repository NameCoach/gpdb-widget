import React, { useContext } from "react";
import ModalTooltip, {
  TooltipActionType,
  PresentationMode,
} from "../../ModalTooltip";
import ShareAction from "./Share";
import ShareOption from "./ShareOption";
import Pronunciation from "../../../../types/resources/pronunciation";
import StyleContext from "../../../contexts/style";
import useCustomFeatures from "../../../hooks/useCustomFeatures";
import useRecordingShare from "../../../hooks/useRecordingShare";

interface Props {
  loading: boolean;
  pronunciation: Pronunciation;
}

const ShareRecording = ({ loading, pronunciation }: Props): JSX.Element => {
  const styleContext = useContext(StyleContext);
  const customFeatures = useCustomFeatures(null, styleContext);
  const [canShare, copyButtons] = useRecordingShare(
    loading,
    pronunciation,
    customFeatures
  );
  return (
    <>
      {canShare && (
        <ModalTooltip
          title="Share"
          id="share_recording"
          base={<ShareAction />}
          showOnClick
          closable
          mode={PresentationMode.Right}
        >
          {copyButtons.map((button, index) => (
            <ShareOption
              shareButton={button}
              key={button.text}
              index={index}
              actionType={TooltipActionType.Button}
            />
          ))}
        </ModalTooltip>
      )}
    </>
  );
};

export default ShareRecording;
