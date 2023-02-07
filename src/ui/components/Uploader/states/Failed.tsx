import React, { useContext } from "react";
import { Card } from "../../../kit/Cards";
import { Row } from "../../../kit/Grid";
import { Button } from "../../../kit/Buttons";
import { UploaderContext } from "../contexts";
import { StyledP, StyledText } from "../../../kit/Topography";
import { Uploader } from "../../shared/components";
import { DARK_RED } from "../../../styles/variables/colors";

export const Failed = () => {
  const { fileName, fileError, close, upload } = useContext(UploaderContext);

  return (
    <Card gap={10}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Uploader
        </StyledText>
      </Row>

      <Row centered>Upload failed</Row>
      <Row centered>
        <StyledText>{fileName}</StyledText>
      </Row>
      <Row centered>
        <StyledP color={DARK_RED}>{fileError}</StyledP>
      </Row>
      <Row centered padding={"10px 0 0 0"}>
        <Button onClick={close}>Cancel</Button>
        <Uploader onFileSelected={upload} accept=".mp3" name="recording" $primary>
          Re-upload
        </Uploader>
      </Row>
    </Card>
  );
};
