import React, { useContext } from "react";
import { Card } from "../../../kit/Cards";
import { Row } from "../../../kit/Grid";
import { Button } from "../../../kit/Buttons";
import { StyledP, StyledText } from "../../../kit/Topography";
import { UploaderContext } from "../contexts";
import { Uploader } from "../../shared/components";

export const Initial = () => {
  const { upload, close } = useContext(UploaderContext);

  const onUploadClick = (e) => {
    e.propagate;
  };

  return (
    <Card gap={10}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Uploader
        </StyledText>
      </Row>

      <Row centered>
        <StyledP>
          Please choose file of '.mp3' type that is less then 5MB.
        </StyledP>
      </Row>

      <Row centered padding={"10px 0 0 0"}>
        <Button onClick={close}>Cancel</Button>

        <Uploader onFileSelected={upload} accept=".mp3" name="recording" $primary>
          Upload
        </Uploader>
      </Row>
    </Card>
  );
};
