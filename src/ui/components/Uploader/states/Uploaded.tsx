import React, { useContext } from "react";
import { Card } from "../../../kit/Cards";
import { Row } from "../../../kit/Grid";
import { Button } from "../../../kit/Buttons";
import { Uploader } from "../../shared/components";
import { SpeakerButton, SpeakerTypes } from "../../../kit/NewIconButtons";
import { StyledText } from "../../../kit/Topography";
import { UploaderContext } from "../contexts";
import useAudio from "../../../hooks/useAudio";

export const Uploaded = () => {
  const { audioUrl, fileName, close, upload } = useContext(UploaderContext);
  const { playAudio, audioPlaying } = useAudio({ audioSrc: audioUrl });

  return (
    <Card gap={10}>
      <Row>
        <StyledText small bold>
          {/* TODO: move to i18n */}
          Uploader
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
        <StyledText>{fileName}</StyledText>
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
