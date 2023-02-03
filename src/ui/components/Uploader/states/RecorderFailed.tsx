import React, { useContext } from "react";
import { Card } from "../../../kit/Cards";
import { Row } from "../../../kit/Grid";
import { Button } from "../../../kit/Buttons";
import { StyledP, StyledText } from "../../../kit/Topography";
import { UploaderContext } from "../contexts";
import { States } from "../types";

export const RecorderFailed = () => {
  const { close, setState } = useContext(UploaderContext);
  const upload = () => setState(States.Initial);

  return (
    <Card gap={10}>
      <Row centered>
        <StyledP>Your microphone is not available</StyledP>
      </Row>

      <Row centered>
        <StyledP>
          Please check the microphone settings in your browser or application
          and try again or use the "Upload" button.
        </StyledP>
      </Row>

      <Row centered padding={"10px 0 0 0"}>
        <Button onClick={close}>Cancel</Button>

        <Button $primary onClick={upload}>
          Upload
        </Button>
      </Row>
    </Card>
  );
};
