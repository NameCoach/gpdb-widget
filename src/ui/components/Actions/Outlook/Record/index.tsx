import React, { MouseEventHandler } from "react";
import IconButtons from "../../../../kit/IconButtons";

interface Props {
  rerecord?: boolean;
  onClick?: MouseEventHandler;
}

const RecordAction = ({ rerecord, onClick }: Props): JSX.Element => {
  return rerecord ? (
    <IconButtons.Edit onClick={onClick} />
  ) : (
    <IconButtons.Microphone onClick={onClick} />
  );
};

export default RecordAction;
