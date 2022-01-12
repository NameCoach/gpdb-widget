import React, { MouseEventHandler } from "react";
import styles from "./styles.module.css";

interface Props {
  onClick?: MouseEventHandler;
}

const Close = (props: Props) => (
  <div className={styles.close} onClick={props.onClick} />
);

export default Close;
