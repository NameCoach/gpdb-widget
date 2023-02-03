import React from "react";
import { IconButton } from "../Buttons/IconButton";
import Loader from "../../components/Loader";
import { Upload } from "../NewIcons";

interface UploadButtonProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
  [x: string]: any;
}

export const UploadButton = ({onClick, disabled = false, loading = false, ...other}: UploadButtonProps) => {
  return <IconButton onClick={onClick} disabled={disabled} {...other}>
    { loading ? <Loader btn/> : <Upload/> }
  </IconButton>
};
