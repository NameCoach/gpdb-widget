import React, { useContext } from "react";
import { PresentationMode } from "../../../types/modal-tooltip";
import Pronunciation from "../../../types/resources/pronunciation";
import { TooltipActionType } from "../../../types/tooltip-action";
import StyleContext from "../../contexts/style";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useRecordingShare from "../../hooks/useRecordingShare";
import ModalTooltip from "../ModalTooltip";
import ChangeableText from "../ModalTooltip/ChangableText";
import ModalTooltipOption from "../ModalTooltip/Option";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ShareAction from "../Actions/Share";

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
            <ModalTooltipOption
              key={index}
              actionType={TooltipActionType.Button}
            >
              <CopyToClipboard text={button.url} key={button.text} debug="true">
                <ChangeableText initialText={button.text} newText="Copied!" />
              </CopyToClipboard>
            </ModalTooltipOption>
          ))}
        </ModalTooltip>
      )}
    </>
  );
};

export default ShareRecording;
