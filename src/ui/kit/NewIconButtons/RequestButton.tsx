import React from "react";
import { IconButton } from "../Buttons/IconButton";
import Loader from "../../components/Loader";
import { Request } from "../NewIcons"

interface RequestButtonProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
}

export const RequestButton = ({onClick, disabled = false, loading = false}: RequestButtonProps) => {
  return <IconButton onClick={onClick} disabled={disabled}>
    { loading ? <Loader btn/> : <Request/> }
  </IconButton>
};
