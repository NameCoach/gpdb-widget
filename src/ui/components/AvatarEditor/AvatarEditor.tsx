import React, { useCallback, useState } from "react";
import { Row } from "../../kit/Grid";
import { Card } from "../../kit/Cards";
import { Avatar } from "../shared/components/Avatar";
import { StyledText } from "../../kit/Topography";
import { BinButton } from "../../kit/NewIconButtons";
import { Uploader } from "../shared/components";
import { MAX_ALLOWED_FILE_SIZE } from "../Recorder/constants";
import { DARK_RED } from "../../styles/variables/colors";
import { UploadLabel } from "../PersonalSection/components/UploadLabel";
import { AvatarEditorProps } from "./types";

const AVATAR_UPLOADER_ACCEPT = ".png, .gif, .jpeg, .jpg";
const AVATAR_MIME_TYPES = ["image/png", "image/gif", "image/jpeg", "image.jpg"];

export const AvatarEditor = ({
  name,
  src,
  tempFileName,
  tempError,
  onDelete,
  onUpload,
  onFail,
}: AvatarEditorProps) => {
  const [fileName, setFileName] = useState<string>(tempFileName);
  const [fileError, setFileError] = useState<string>(tempError);
  const [avatarUrl, setAvatarUrl] = useState<string>(src);

  const upload = useCallback(
    (e: Event) => {
      setFileError(null);

      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (!files || files.length === 0) return;

      const file = files[0];
      setFileName(file.name);

      if (file.size > MAX_ALLOWED_FILE_SIZE) {
        const error =
          "File must be less then 5MB.";
        setFileError(error);
        if (onFail) setTimeout(() => onFail(error), 0);
        return;
      }

      if (!AVATAR_MIME_TYPES.includes(file.type)) {
        const error = `File must be of '${AVATAR_UPLOADER_ACCEPT}' types.`;
        setFileError(error);
        if (onFail) setTimeout(() => onFail(error), 0);
        return;
      }

      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = ({ target }): void => {
        const blob = new Blob([target.result]);
        const url = URL.createObjectURL(blob);
        setAvatarUrl(url);
        if (onUpload) onUpload({ file, url });
      };
    },
    [onUpload, onFail]
  );

  const onBinClick = () => {
    setFileError(null);
    setFileName(null);
    setAvatarUrl(null);
    if (onDelete) onDelete();
  };

  return (
    <Card gap={20}>
      <Row gap={8}>
        <Row left autoWidth flex={"0 0 auto"}>
          <Avatar name={name} src={avatarUrl} />
        </Row>
        <Row>
          {fileError ? (
            <StyledText color={DARK_RED}>{fileError}</StyledText>
          ) : (
            <StyledText>{fileName}</StyledText>
          )}
        </Row>
        <Row gap={8} right autoWidth flex={"0 0 auto"}>
          <Uploader
            name={"avatar"}
            accept={AVATAR_UPLOADER_ACCEPT}
            label={UploadLabel}
            onFileSelected={upload}
          />
          <BinButton disabled={!avatarUrl} onClick={onBinClick} />
        </Row>
      </Row>
    </Card>
  );
};
