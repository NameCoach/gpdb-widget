import React, { useLayoutEffect, useRef, useState } from "react";
import { Row } from "../../../kit/Grid";
import { COUNTDOWN, ONE_SECOND } from "../../Recorder/constants";
import { StyledText } from "../../../kit/Topography";
import { Button } from "../../../kit/Buttons";
import { Card } from "../../../kit/Cards";
import { useTransitions } from "../hooks";

export const Countdown = () => {
  const { ToRecording, ToInitial } = useTransitions();

  const interval = useRef<ReturnType<typeof setInterval>>(null);
  const transitionInterval = useRef<ReturnType<typeof setInterval>>(null);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN);
  const tickCountdown = () => setCountdown((countdown) => --countdown);

  useLayoutEffect(() => {
    interval.current = setInterval(tickCountdown, ONE_SECOND);
    transitionInterval.current = setInterval(ToRecording, 3 * ONE_SECOND);

    return () => {
      clearInterval(interval.current);
      clearInterval(transitionInterval.current);
    };
  }, []);

  return (
    <Card gap={10}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Recorder
        </StyledText>
      </Row>

      <Row centered>
        <StyledText>
          {/* TODO: move to i18n */}
          Recording starts in...
        </StyledText>
      </Row>
      <Row centered>
        <StyledText>
          {/* TODO: move to i18n */}
          {countdown}
        </StyledText>
      </Row>
      <Row padding="10px 0 0 0" centered>
        <Button onClick={ToInitial}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>
      </Row>
    </Card>
  );
};
