import React from "react";
import { IconButton } from "../Buttons/IconButton";
import Loader from "../../components/Loader";
import { Close } from "../NewIcons";

interface CloseButtonProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
}

export const CloseButton = ({onClick, disabled = false, loading = false}: CloseButtonProps) => {
  return <IconButton onClick={onClick} disabled={disabled}>
    { loading ? <Loader btn/> : <Close/> }
  </IconButton>
};
