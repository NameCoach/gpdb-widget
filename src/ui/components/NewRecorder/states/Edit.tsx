import React, { useContext } from "react";
import { Row } from "../../../kit/Grid";
import { Button } from "../../../kit/Buttons";
import { Card } from "../../../kit/Cards";
import { useTransitions } from "../hooks";
import { StyledText } from "../../../kit/Topography";

export const Edit = () => {
  const { ToDeleted, ToCountdown, ToClosed } = useTransitions();

  return (
    <Card gap={20}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Recorder
        </StyledText>
      </Row>

      <Row centered>
        <Button onClick={ToDeleted} $danger>
          {/* TODO: move to i18n */}
          Delete Recording
        </Button>
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
