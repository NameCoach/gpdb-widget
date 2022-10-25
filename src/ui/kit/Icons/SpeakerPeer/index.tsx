import React from "react";
import { ReactComponent as SpeakerPeer } from "./speaker-peer.svg";
import styles from "../styles.module.css";
import { PlayableIconProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SpeakerPeerIcon = ({
  style,
  className,
  playing,
}: PlayableIconProps): React.ReactElement<PlayableIconProps> => (
  <SpeakerPeer
    className={cx(styles.main, className, { playing: playing })}
    style={style}
  />
);

export default SpeakerPeerIcon;
