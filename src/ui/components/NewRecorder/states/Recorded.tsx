import React, { useContext } from "react";
import { ActionTypes } from "../types";
import { Row } from "../../../kit/Grid";
import useAudio from "../../../hooks/useAudio";
import { Button, Link } from "../../../kit/Buttons";
import { SpeakerButton, SpeakerTypes } from "../../../kit/NewIconButtons";
import { Card } from "../../../kit/Cards";
import { useTransitions } from "../hooks";
import { StyledText } from "../../../kit/Topography";

export const Recorded = () => {
  const {
    ToClosed,
    ToCountdown,
    ToSettings,
    recorderState: { audioUrl },
  } = useTransitions();

  const { playAudio, audioPlaying } = useAudio({ audioSrc: audioUrl });

  return (
    <Card gap={20}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Recorder
        </StyledText>
      </Row>

      <Row centered>
        <SpeakerButton
          type={SpeakerTypes.Default}
          active={audioPlaying}
          onClick={playAudio}
        />
      </Row>
      <Row centered>
        <Button onClick={ToClosed}>
          {/* TODO: move to i18n */}
          Cancel
        </Button>
        <Button onClick={ToCountdown} $danger>
          {/* TODO: move to i18n */}
          Re-record
        </Button>
      </Row>
      {/* <Row centered> */}
      {/*  <Link onClick={ToSettings}> */}
      {/*    /!* TODO: move to i18n *!/ */}
      {/*    Having trouble with pitch? */}
      {/*  </Link> */}
      {/* </Row> */}
    </Card>
  );
};
