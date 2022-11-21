import React from "react";
import { ReactComponent as SpeakerLibrary } from "./speaker-library.svg";
import styles from "../styles.module.css";
import { PlayableIconProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SpeakerLibraryIcon = ({
  style,
  className,
  playing,
}: PlayableIconProps): React.ReactElement<PlayableIconProps> => (
  <SpeakerLibrary
    className={cx(styles.main, className, { playing: playing })}
    style={style}
  />
);

export default SpeakerLibraryIcon;
