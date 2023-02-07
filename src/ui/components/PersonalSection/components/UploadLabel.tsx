import React from "react";
import { IconButtonLabel } from "../../../kit/Labels";
import Loader from "../../Loader";
import { Upload } from "../../../kit/NewIcons";

interface UploadLabelProps {
  onClick?: () => any;
  disabled?: boolean;
  loading?: boolean;
  [x: string]: any;
}

export const UploadLabel = ({onClick, disabled = false, loading = false, ...other}: UploadLabelProps) => {
  return <IconButtonLabel onClick={onClick} disabled={disabled} {...other}>
    { loading ? <Loader btn/> : <Upload/> }
  </IconButtonLabel>
};
