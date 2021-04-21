import React, { ReactNode } from "react";
import styles from "./styles.module.css";

interface Props {
  children: ReactNode;
}

const FullName = (props: Props) => (
  <div className={styles.head}>
    <div className={styles.head__names}>{props.children}</div>
  </div>
);

export default FullName;
