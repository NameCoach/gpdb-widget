import classNames from "classnames/bind";
import React from "react";
import { IconBasicProps } from "../types";
import { ReactComponent as Microphone } from "./microphone.svg";
import styles from "../styles.module.css";

const cx = classNames.bind(styles);

const MicrophoneIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Microphone className={cx(styles.main, className)} style={style} />
);

export default MicrophoneIcon;
