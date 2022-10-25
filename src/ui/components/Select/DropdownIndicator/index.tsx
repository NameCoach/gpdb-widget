import React from "react";
import { components } from "react-select";
import Icons from "../../../kit/Icons";
import styles from "./styles.module.css";

const DropdownIndicator = (props: any) => {
  const menuOpened = props.selectProps.menuIsOpen;

  return (
    <components.DropdownIndicator
      {...props}
      className={styles.override_default}
    >
      <Icons.Shevron up={menuOpened} />
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
