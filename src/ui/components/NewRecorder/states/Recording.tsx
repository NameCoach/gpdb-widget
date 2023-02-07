import React, { useLayoutEffect, useRef, useState } from "react";
import { Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import { ONE_SECOND } from "../../Recorder/constants";
import { Button } from "../../../kit/Buttons";
import { Card } from "../../../kit/Cards";
import { useTransitions } from "../hooks";

export const Recording = () => {
  const { ToInitial, ToRecorded, recorderState } = useTransitions();

  const [recordTime, setRecordTime] = useState<number>(0);
  const interval = useRef<ReturnType<typeof setInterval>>(null);

  const stopRecording = () => {
    recorderState.recorder.stopRecording(ToRecorded);
  };

  const tickRecordTime = () => {
    setRecordTime((recordTime) => {
      if (recordTime < 10) return ++recordTime;

      return 10;
    });
  };

  useLayoutEffect(() => {
    const { recorder } = recorderState;

    recorder.setRecordingDuration(10 * ONE_SECOND, ToRecorded);
    recorder.startRecording();

    interval.current = setInterval(tickRecordTime, ONE_SECOND);

    return () => {
      clearInterval(interval.current);
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
          Recording...
        </StyledText>
      </Row>
      <Row centered>
        <StyledText>
          {"00:" +
            (recordTime < 10 ? "0" + recordTime : recordTime) +
            " - 00:10"}
        </StyledText>
      </Row>
      <Row centered gap={8} padding="10px 0 0 0">
        <Button onClick={ToInitial}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>
        <Button onClick={stopRecording} $primary>
          {/* TODO: move to i18n */}
          Stop
        </Button>
      </Row>
    </Card>
  );
};
