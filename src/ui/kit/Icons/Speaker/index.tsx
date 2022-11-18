import React from "react";
import { ReactComponent as Speaker } from "./speaker.svg";
import styles from "../styles.module.css";
import { PlayableIconProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SpeakerIcon = ({
  style,
  className,
  playing,
}: PlayableIconProps): React.ReactElement<PlayableIconProps> => (
  <Speaker
    className={cx(styles.main, className, { playing: playing })}
    style={style}
  />
);

export default SpeakerIcon;
