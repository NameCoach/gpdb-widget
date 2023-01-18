import React from "react";
import { StyledIconButton } from "./StyledIconButton";
import { Request } from "../NewIcons/Request";
import Loader from "../../components/Loader";

interface RequestButtonProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
}

export const RequestButton = ({onClick, disabled = false, loading = false}: RequestButtonProps) => {
  return <StyledIconButton onClick={onClick} disabled={disabled}>
    { loading ? <Loader btn/> : <Request disabled={disabled}/> }
  </StyledIconButton>
};
