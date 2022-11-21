import React from "react";
import { ReactComponent as Search } from "./search.svg";
import styles from "../styles.module.css";
import { IconBasicProps } from "../types";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const SearchIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Search className={cx(styles.main, className)} style={style} />
);

export default SearchIcon;
