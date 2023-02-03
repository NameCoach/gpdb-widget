import React from "react";
import { ActionTypes } from "../types";
import { Row } from "../../../kit/Grid";
import { StyledP, StyledText } from "../../../kit/Topography";
import { Button } from "../../../kit/Buttons";
import { MAX_SAMPLE_RATE, MIN_SAMPLE_RATE } from "../../Recorder/constants";
import RangeInput from "../../Recorder/Components/RangeInput";
import { Card } from "../../../kit/Cards";
import { useTransitions } from "../hooks";

export const Settings = () => {
  const {
    ToRecorded,
    ToCountdown,
    recorderState: { sampleRate, defaultSampleRate },
    dispatch,
  } = useTransitions();

  return (
    <Card gap={10}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Recorder
        </StyledText>
      </Row>

      <Row centered>
        <StyledP>
          {/* TODO: move to i18n */}
          Your browser may cause pitch issues while recording. Try adjusting the
          pitch slider below, then re-record with the new pitch setting.
        </StyledP>
      </Row>
      <Row centered>
        <RangeInput
          min={MIN_SAMPLE_RATE}
          max={MAX_SAMPLE_RATE}
          values={[sampleRate]}
          // TODO: resolve sampleRate[0] somehow range returns sample rate as an array [44000]
          onChange={(sampleRate) => {
            dispatch({
              type: ActionTypes.SetSampleRate,
              sampleRate: sampleRate[0],
            });
          }}
          onDefaultClicked={() =>
            dispatch({
              type: ActionTypes.SetSampleRate,
              sampleRate: defaultSampleRate,
            })
          }
        />
      </Row>
      <Row centered padding="10px 0 0 0">
        <Button onClick={ToRecorded}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>
        <Button $primary onClick={ToCountdown}>
          {/* TODO: move to i18n */}
          Re-record
        </Button>
      </Row>
    </Card>
  );
};
