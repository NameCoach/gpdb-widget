import React, { useRef } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactTooltip from "react-tooltip";

const cx = classNames.bind(styles);

interface Props {
  url: string;
  text: string;
}

const ShareAudioUrlAction = (props: Props): JSX.Element => {
  const tooltipDataRef = useRef(null);

  const url = props.url.split("?")[0];

  const showTooltip = (): void => {
    ReactTooltip.show(tooltipDataRef.current);
  };

  return (
    <>
      <CopyToClipboard text={url}>
        <div
          ref={tooltipDataRef}
          data-tip={props.text}
          aria-label="Share pronunciation"
          className={cx(styles.icon_button)}
          onClick={showTooltip}
        >
          <ReactTooltip
            uuid="share_audio_tooltip"
            event="none"
            eventOff="mouseout"
            delayHide={500}
            textColor="white"
            backgroundColor="#946cc1"
          />

          <i className={cx("share-audio-url")} />
        </div>
      </CopyToClipboard>
    </>
  );
};

export default ShareAudioUrlAction;
