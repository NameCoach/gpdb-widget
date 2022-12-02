import React, { useCallback, useContext, useMemo } from "react";
import Pronunciation from "../../../types/resources/pronunciation";
import StyleContext from "../../contexts/style";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useRecordingShare from "../../hooks/useRecordingShare";
import DefaultShareAction from "../Actions/Share";
import Tooltip from "../../kit/Tooltip";
import useTranslator from "../../hooks/useTranslator";
import useTheme from "../../hooks/useTheme";
import { Theme } from "../../../types/style-context";
import ShareAction from "../Actions/Outlook/Share";
import generateTooltipId from "../../../core/utils/generate-tooltip-id";
import useTooltip from "../../kit/Tooltip/hooks/useTooltip";
import Popup from "../../kit/Popup";
import { Button, Text } from "../../kit/Popup/components";
import usePopup from "../../kit/Popup/hooks/usePopup";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import ChangeableText from "../../kit/ChangableText";
import { CopyToClipboard } from "react-copy-to-clipboard";

const cx = classNames.bind(styles);

const SHARE_TOOLTIP_SIDE_OFFSET = 0;
const SHARE_POPUP_SIDE_OFFSET = 0;

interface Props {
  loading: boolean;
  pronunciation: Pronunciation;
  tooltipId?: string;
}

const ShareRecording = ({
  loading,
  pronunciation,
  tooltipId = generateTooltipId("share_recording"),
}: Props): JSX.Element => {
  const { theme } = useTheme();

  const tooltipBaseComponent = useMemo(() => {
    return theme === Theme.Outlook ? <ShareAction /> : <DefaultShareAction />;
  }, [theme]);

  const styleContext = useContext(StyleContext);
  const { t } = useTranslator();
  const tooltip = useTooltip<HTMLDivElement>();
  const popup = usePopup<HTMLDivElement>();
  const openerRef = useCallback((ref) => {
    tooltip.openerRef(ref);
    popup.openerRef(ref);
  }, []);

  const customFeatures = useCustomFeatures(null, styleContext);
  const [canShare, copyButtons] = useRecordingShare(
    loading,
    pronunciation,
    customFeatures
  );

  return (
    <>
      {canShare && (
        <div>
          <Tooltip
            id={tooltipId}
            opener={tooltip.opener}
            ref={tooltip.tooltipRef}
            disabled={popup.popup?.isShown}
            rightArrow
            arrowSideOffset={SHARE_TOOLTIP_SIDE_OFFSET}
          >
            {t("share_audio_url_tooltip", "Copy your audio link here")}
          </Tooltip>
          <Popup
            opener={popup.opener}
            ref={popup.popupRef}
            closeable
            closeOnOuterClick
            rightArrow
            arrowSideOffset={SHARE_POPUP_SIDE_OFFSET}
          >
            <div className={cx(styles.column)}>
              <Text>{t("share_recording_popup_title")}</Text>
              <div className={cx(styles.row)}>
                {copyButtons.map((button, index) => (
                  <CopyToClipboard text={button.url} key={index}>
                    <Button style={{width: button.width}}>
                      <ChangeableText
                        initialText={button.text}
                        newText={t("share_recording_popup_copied")}
                        revertAfterChange
                      />
                    </Button>
                  </CopyToClipboard>
                ))}
              </div>
            </div>
          </Popup>
          <div ref={openerRef} onClick={popup.openerOnMouseClick}>
            {React.cloneElement(tooltipBaseComponent)}
          </div>
        </div>
      )}
    </>
  );
};

export default ShareRecording;
