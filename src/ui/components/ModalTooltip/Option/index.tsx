import React from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import Children, { Child } from "../../../../types/children-prop";

interface Props {
  actionType: any;
  onClick?: () => void;
  children: Children | Child;
}

const cx = classNames.bind(styles);

const ModalTooltipOption = ({
  children,
  onClick,
  actionType,
}: Props): JSX.Element => {
  return (
    <div className={cx(styles[actionType])} onClick={onClick}>
      {children}
    </div>
  );
};

export default ModalTooltipOption;
