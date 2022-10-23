import React from "react";
import { ReactComponent as SpeakerOwner } from "./speaker-owner.svg";
import styles from "../styles.module.css";
import { PlayableIconProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SpeakerOwnerIcon = ({
  style,
  className,
  playing,
}: PlayableIconProps): React.ReactElement<PlayableIconProps> => (
  <SpeakerOwner
    className={cx(styles.main, className, { playing: playing })}
    style={style}
  />
);

export default SpeakerOwnerIcon;
