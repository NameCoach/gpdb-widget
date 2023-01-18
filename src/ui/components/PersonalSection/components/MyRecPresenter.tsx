import React from "react";
import { StyledColumn as Column, Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import Pronunciation from "../../../../types/resources/pronunciation";
import IconButtons from "../../../kit/IconButtons";
import { Speaker } from "../../shared/components";

interface MyRecPresenterProps {
  name: string;
  pronunciation: Pronunciation;
  firstName: string;
  firstNamePronunciation: Pronunciation;
  lastName: string;
  lastNamePronunciation: Pronunciation;
  onEditClick: () => any;
  visible?: boolean;
}

export const MyRecPresenter = ({
  name,
  pronunciation,
  firstName,
  firstNamePronunciation,
  lastName,
  lastNamePronunciation,
  onEditClick,
  visible
}: MyRecPresenterProps) => {
  return (
    <Column visible={visible}>
      <Row padding={"8px 0"}>
        <Row>
          <StyledText medium>{name}</StyledText>
        </Row>
        <Row gap={8} right autoWidth>
          {!firstNamePronunciation && !lastNamePronunciation && (
            <>
              {pronunciation ? (
                <Speaker pronunciation={pronunciation} />
              ) : (
                <Speaker disabled />
              )}
            </>
          )}
          <IconButtons.Edit onClick={onEditClick} />
        </Row>
      </Row>

      {(firstNamePronunciation || lastNamePronunciation) && (
        <>
          <Row padding={"16px 0"}>
            <StyledText medium>{firstName}</StyledText>
            {firstNamePronunciation ? (
              <Speaker pronunciation={firstNamePronunciation} />
            ) : (
              <Speaker disabled />
            )}
          </Row>
          <Row padding={"16px 0"}>
            <StyledText medium>{lastName}</StyledText>
            {lastNamePronunciation ? (
              <Speaker pronunciation={lastNamePronunciation} />
            ) : (
              <Speaker disabled />
            )}
          </Row>
        </>
      )}
    </Column>
  );
};
