import React from "react";
import { SavedIconProps } from "../types";
import BookmarkSavedIcon from "./saved";
import { BookmarkIcon as BookmarkDefaultIcon } from "./default";

const BookmarkIcon = ({
  style,
  saved,
}: SavedIconProps): React.ReactElement<SavedIconProps> =>
  saved ? (
    <BookmarkSavedIcon style={style} />
  ) : (
    <BookmarkDefaultIcon style={style} />
  );

export default BookmarkIcon;
