import React from "react";
import { ReactComponent as SpeakerNoRecording } from "./speaker-no-recording.svg";
import styles from "../styles.module.css";
import { PlayableIconProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SpeakerNoRecordingIcon = ({
  style,
  className = styles.disableHover,
  playing,
}: PlayableIconProps): React.ReactElement<PlayableIconProps> => (
  <SpeakerNoRecording
    className={cx(styles.main, className, { playing: playing })}
    style={style}
  />
);

export default SpeakerNoRecordingIcon;
