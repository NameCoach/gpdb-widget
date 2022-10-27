import React, { MouseEventHandler } from "react";
import IconButtons from "../../../../kit/IconButtons";

interface Props {
  saved: boolean;
  onClick: MouseEventHandler;
}

const UserResponseAction = ({ saved, onClick }: Props): JSX.Element => (
  <IconButtons.Bookmark iconOptions={{ saved }} onClick={onClick} />
);

export default UserResponseAction;
