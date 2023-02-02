import React from "react";
import { StyledColumn as Column, Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import Pronunciation from "../../../../types/resources/pronunciation";
import IconButtons from "../../../kit/IconButtons";
import { Speaker } from "../../shared/components";
import { Avatar } from "../../shared/components/Avatar";
import useFeaturesManager, { ShowComponents } from "../../../hooks/useFeaturesManager";

interface MyRecPresenterProps {
  name: string;
  pronunciation: Pronunciation;
  firstName: string;
  firstNamePronunciation: Pronunciation;
  lastName: string;
  lastNamePronunciation: Pronunciation;
  onEditClick: () => any;
  avatarUrl?: string;
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
  avatarUrl,
  visible,
}: MyRecPresenterProps) => {
  const { show } = useFeaturesManager();
  
  return (
    <Column visible={visible}>
      <Row padding={"8px 0"}>
        {show(ShowComponents.Avatars) && (
          <Row left autoWidth flex={"0 0 auto"}>
            <Avatar name={name} src={avatarUrl} />
          </Row>
        )}
        <Row>
          <StyledText medium>{name}</StyledText>
        </Row>
        <Row gap={8} right autoWidth flex={"0 0 auto"}>
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
