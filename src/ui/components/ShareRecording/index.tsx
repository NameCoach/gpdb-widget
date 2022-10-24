import React, { useContext, useEffect, useMemo, useState } from "react";
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
import DefaultShareAction from "../Actions/Share";
import Tooltip from "../Tooltip";
import useTranslator from "../../hooks/useTranslator";
import ReactTooltip from "react-tooltip";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../../types/style-context";
import ShareAction from "../Actions/Outlook/Share";

interface Props {
  loading: boolean;
  pronunciation: Pronunciation;
}

const ShareRecording = ({ loading, pronunciation }: Props): JSX.Element => {
  const tooltipId = Date.now().toString();
  const [showHintTooltip, setShowHintTooltip] = useState(true);

  const { theme } = useTheme();

  const tooltipBaseComponent = useMemo(() => {
    return theme === Theme.Outlook ? <ShareAction /> : <DefaultShareAction />;
  }, [theme]);

  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(null, styleContext);

  const customFeatures = useCustomFeatures(null, styleContext);
  const [canShare, copyButtons] = useRecordingShare(
    loading,
    pronunciation,
    customFeatures
  );

  const onShowCb = (): void => {
    setShowHintTooltip(false);
    ReactTooltip.hide();
  };

  const onHideCb = (): void => setShowHintTooltip(true);
  // ????
  useEffect(() => {}, [showHintTooltip]);

  return (
    <>
      {canShare && (
        <>
          <Tooltip
            id={tooltipId}
            place="top"
            effect="solid"
            hidden={!showHintTooltip}
          />

          <div
            data-tip={t("share_audio_url_tooltip", "Copy your audio link here")}
            data-for={tooltipId}
          >
            <ModalTooltip
              title="Share"
              id="share_recording"
              base={tooltipBaseComponent}
              showOnClick
              closable
              actionsClassName="inline_actions"
              mode={PresentationMode.Right}
              onShowCb={onShowCb}
              onHideCb={onHideCb}
            >
              {copyButtons.map((button, index) => (
                <ModalTooltipOption
                  key={index}
                  actionType={TooltipActionType.InlineButton}
                >
                  <CopyToClipboard
                    text={button.url}
                    key={button.text}
                    debug="true"
                  >
                    <ChangeableText
                      initialText={button.text}
                      newText="Copied!"
                    />
                  </CopyToClipboard>
                </ModalTooltipOption>
              ))}
            </ModalTooltip>
          </div>
        </>
      )}
    </>
  );
};

export default ShareRecording;
