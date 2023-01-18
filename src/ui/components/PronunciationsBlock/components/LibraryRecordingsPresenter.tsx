import React, { useState } from "react";
import Pronunciation from "../../../../types/resources/pronunciation";
import { Column, Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import { Speaker } from "../../shared/components";
import { RequestButton } from "../../../kit/Buttons/RequestButton";

interface LibraryRecordingsPresenterProps {
  firstName: string;
  lastName: string;
  firstNamePronunciation: Pronunciation;
  lastNamePronunciation: Pronunciation;
  firstNamePending: boolean;
  lastNamePending: boolean;
  onFirstNameRecRequest: () => any;
  onLastNameRecRequest: () => any;
}

export const LibraryRecordingsPresenter = ({
  firstName,
  lastName,
  firstNamePronunciation,
  lastNamePronunciation,
  firstNamePending,
  lastNamePending,
  onFirstNameRecRequest,
  onLastNameRecRequest,
}: LibraryRecordingsPresenterProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Column gap={16}>
      <Column gap={8}>
        <Row>
          <StyledText medium>{firstName}</StyledText>
        </Row>
        {firstNamePronunciation ? (
          <Row>
            <Row>
              <StyledText small>{firstNamePronunciation.language}</StyledText>
            </Row>
            <Row right autoWidth>
              <Speaker pronunciation={firstNamePronunciation} />
            </Row>
          </Row>
        ) : (
          <Row>
            <Row>
              <StyledText small gray>
                {firstNamePending
                  ? "Recording request pending"
                  : "Pronunciation not available"}
              </StyledText>
            </Row>
            <Row right autoWidth>
              <RequestButton
                onClick={() => {
                  setLoading(true);
                  onFirstNameRecRequest().then(() => setLoading(false));
                }}
                disabled={firstNamePending}
              />
            </Row>
          </Row>
        )}
      </Column>
      <Column gap={8}>
        <Row>
          <StyledText medium>{lastName}</StyledText>
        </Row>
        {lastNamePronunciation ? (
          <Row>
            <Row>
              <StyledText small>{lastNamePronunciation.language}</StyledText>
            </Row>
            <Row right autoWidth>
              <Speaker pronunciation={lastNamePronunciation} />
            </Row>
          </Row>
        ) : (
          <Row>
            <Row>
              <StyledText small gray>
                {lastNamePending
                  ? "Recording request pending"
                  : "Pronunciation not available"}
              </StyledText>
            </Row>
            <Row right autoWidth>
              <RequestButton
                onClick={() => {
                  setLoading(true);
                  onLastNameRecRequest().then(() => setLoading(false));
                }}
                disabled={lastNamePending}
              />
            </Row>
          </Row>
        )}
      </Column>
    </Column>
  );
};
