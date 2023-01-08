import React, { useState } from "react";
import { Column, Row } from "../../../kit/Grid";
import { StyledText } from "../../../kit/Topography";
import { RecorderButton } from "./RecorderButton";
import { LibraryRecordingsButton } from "./LibraryRecordingsButton";
import { LibraryRecordings } from "../../LibraryRecordings";
import { NameTypes } from "../../../../types/resources/name";
import Pronunciation, {
  RelativeSource,
} from "../../../../types/resources/pronunciation";
import { NameOwner } from "gpdb-api-client";
import NewRecorder from "../../Recorder";
import { Button } from "../../../kit/Buttons";
import { StyledGap } from "../../../kit/Grid/StyledGap";
import { RecorderCloseOptions } from "../../Recorder/types/handlers-types";
import { DeletedRecordingNotification } from "./DeletedRecordingNotification";
import useFeaturesManager, {
  ShowComponents,
} from "../../../hooks/useFeaturesManager";

interface MyRecEditorProps {
  name: string;
  pronunciation: Pronunciation;
  firstName: string;
  firstNamePronunciation: Pronunciation;
  lastName: string;
  lastNamePronunciation: Pronunciation;
  owner: NameOwner;
  termsAndConditions: any;
  onRecorderOpen: () => any;
  onRecordingDelete: () => any;
  onCancelClick: () => any;
  onSave: () => any;
  visible?: boolean;
  onLibraryDelete: () => any;
}

export const MyRecEditor = ({
  name,
  pronunciation,
  firstName,
  firstNamePronunciation,
  lastName,
  lastNamePronunciation,
  owner,
  termsAndConditions,
  onRecorderOpen,
  onRecordingDelete,
  onCancelClick,
  onSave,
  visible,
  onLibraryDelete,
}: MyRecEditorProps) => {
  const [recorderOpened, setRecorderOpened] = useState<boolean>(false);
  const [libraryOpened, setLibraryOpened] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const { show } = useFeaturesManager();

  return (
    <Column visible={visible}>
      <Row>
        <StyledText medium>{name}</StyledText>
      </Row>
      <StyledGap height={16} />
      <Row>
        <StyledText medium>
          {/* TODO: move to i18n */}
          My name recording
        </StyledText>
      </Row>
      <StyledGap height={8} />
      {recorderOpened && (
        <>
          {!showNotification && (
            <Row>
              <NewRecorder
                name={name}
                type={NameTypes.FullName}
                owner={owner}
                onRecorderClose={(option) => {
                  if (option === RecorderCloseOptions.CANCEL) {
                    setRecorderOpened(false);
                  } else if (option === RecorderCloseOptions.DELETE) {
                    setShowNotification(true);
                  }
                }}
                onSaved={() => {
                  onSave();
                  setRecorderOpened(false);
                }}
                termsAndConditions={termsAndConditions}
                pronunciation={pronunciation}
                relativeSource={RelativeSource.RequesterSelf}
              />
            </Row>
          )}
          <Row visible={showNotification}>
            <DeletedRecordingNotification
              onClose={() => {
                onRecordingDelete().finally(onSave);
              }}
              onRestore={() => {
                setShowNotification(false);
              }}
            />
          </Row>
          <StyledGap height={8} />
        </>
      )}
      {libraryOpened && (
        <>
          <LibraryRecordings
            firstName={firstName}
            lastName={lastName}
            firstNamePronunciation={firstNamePronunciation}
            lastNamePronunciation={lastNamePronunciation}
            owner={owner}
            name={name}
            onCancel={() => setLibraryOpened(false)}
            onSaved={() => {
              onSave();
              setLibraryOpened(false);
            }}
            onDelete={onLibraryDelete}
          />
          <StyledGap height={8} />
        </>
      )}
      <Row>
        {!recorderOpened && (
          <RecorderButton
            onClick={() => {
              setLibraryOpened(false);
              setRecorderOpened(true);
              onRecorderOpen();
            }}
          />
        )}
        {!libraryOpened && show(ShowComponents.LibraryRecordings) && (
          <LibraryRecordingsButton
            onClick={() => {
              setRecorderOpened(false);
              setLibraryOpened(true);
            }}
          />
        )}
      </Row>
      {!recorderOpened && !libraryOpened && (
        <>
          <StyledGap height={18} />
          <Row centered>
            <Button onClick={onCancelClick}>
              {/* TODO: move to i18n */}
              Cancel
            </Button>
          </Row>
        </>
      )}
    </Column>
  );
};
