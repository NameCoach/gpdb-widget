import React from "react";
import { IconBasicProps } from "../../types";
import { ReactComponent as BookmarkSaved } from "./bookmark-saved.svg";

const BookmarkSavedIcon = ({
  style,
  className,
}: IconBasicProps): React.ReactElement<IconBasicProps> => (
  <BookmarkSaved className={className} style={style} />
);

export default BookmarkSavedIcon;
