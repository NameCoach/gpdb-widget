import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ShareButton } from "../../../../hooks/useRecordingShare";
import { TOOLTIP_AUTOCLOSE_DELAY } from "../../../../../constants";
import { TooltipActionType } from "../../../ModalTooltip";
import classNames from "classnames/bind";
import styles from "./styles.module.css";

interface Props {
  shareButton: ShareButton;
  onClick?: (value: any) => void;
  actionType?: TooltipActionType;
  index: number;
}

const cx = classNames.bind(styles);

const ShareOption = ({
  shareButton,
  index,
  onClick,
  actionType,
}: Props): JSX.Element => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(null);

  const showCopySuccess = (index) => (): void => {
    setShowSuccess(true);
    setClickedIndex(index);
    onClick && onClick(TOOLTIP_AUTOCLOSE_DELAY);
  };

  return (
    <CopyToClipboard
      className={cx(actionType)}
      text={shareButton.url}
      key={index}
      onCopy={showCopySuccess(index)}
    >
      <button>
        {showSuccess && clickedIndex === index ? "Copied!" : shareButton.text}
      </button>
    </CopyToClipboard>
  );
};

export default ShareOption;
