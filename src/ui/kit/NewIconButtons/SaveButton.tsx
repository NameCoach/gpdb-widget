import React from "react";
import { IconButton } from "../Buttons/IconButton";
import Loader from "../../components/Loader";
import { Save, SaveActive } from "../NewIcons";

interface SaveButtonProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
}

export const SaveButton = ({onClick, disabled = false, loading = false, active = false}: SaveButtonProps) => {
  return <IconButton onClick={onClick} disabled={disabled}>
    {
      loading ? <Loader btn/> : <>
        {
          active ? <SaveActive/> : <Save/>
        }
      </>
    } 
  </IconButton>
};
