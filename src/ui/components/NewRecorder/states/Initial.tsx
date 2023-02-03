import React from "react";
import { ActionTypes } from "../types";
import { Row } from "../../../kit/Grid";
import { StyledP, StyledText } from "../../../kit/Topography";
import { Button } from "../../../kit/Buttons";
import { Card } from "../../../kit/Cards";
import { useTransitions } from "../hooks";

export const Initial = () => {
  const { ToClosed, ToCountdown } = useTransitions();

  return (
    <Card gap={20}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Recorder
        </StyledText>
      </Row>
      
      <Row centered>
        <StyledP>
          {/* TODO: move to i18n */}
          To make your own recording, click ‘Start’ and wait for the 3 second
          countdown. Then say the name you’re recording and click the ‘Stop’
          recording button.
        </StyledP>
      </Row>
      <Row centered gap={8}>
        <Button onClick={ToClosed}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>
        <Button onClick={ToCountdown} $primary>
          {/* TODO: move to i18n */}
          Start
        </Button>
      </Row>
    </Card>
  );
};
