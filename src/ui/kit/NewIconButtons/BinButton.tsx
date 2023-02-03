import React from "react";
import { IconButton } from "../Buttons/IconButton";
import Loader from "../../components/Loader";
import { Bin } from "../NewIcons";

interface BinButtonProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
}

export const BinButton = ({onClick, disabled = false, loading = false}: BinButtonProps) => {
  return <IconButton onClick={onClick} disabled={disabled}>
    { loading ? <Loader btn/> : <Bin/> }
  </IconButton>
};
