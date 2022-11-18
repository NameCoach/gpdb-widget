import classNames from "classnames/bind";
import React from "react";
import { IconBasicProps } from "../../types";
import { ReactComponent as Bookmark } from "./bookmark-default.svg";
import styles from "../../styles.module.css";

const cx = classNames.bind(styles);

export const BookmarkIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <Bookmark className={cx(styles.main, className)} style={style} />
);

export default BookmarkIcon;
