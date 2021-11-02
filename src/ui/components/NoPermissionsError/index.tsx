import React from "react";
import classNames from "classnames/bind";
import styles from "../PronunciationMyInfoWidget/styles.module.css";

const cx = classNames.bind(styles);

const NoPermissionsError = (): JSX.Element => (
  <div className={cx(styles.container)}>
    You can't create or listen to any recordings. Please contact your
    administrator to get this fixed.
  </div>
);

export default NoPermissionsError;
