import React, { useLayoutEffect, useState } from "react";
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
import { DeletedNotification } from "./DeletedNotification";
import useFeaturesManager, {
  ShowComponents,
} from "../../../hooks/useFeaturesManager";
import { Avatar } from "../../shared/components/Avatar";

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
  onLibraryDelete: () => any;
  avatarUrl?: string;
  visible?: boolean;
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
  onLibraryDelete,
  avatarUrl,
  visible,
}: MyRecEditorProps) => {
  const [recorderOpened, setRecorderOpened] = useState<boolean>(null);
  const [libraryOpened, setLibraryOpened] = useState<boolean>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [
    showLibraryNotification,
    setShowLibraryNotification,
  ] = useState<boolean>(false);
  const { show } = useFeaturesManager();

  useLayoutEffect(() => {
    if (visible) return;

    setRecorderOpened(
      !!(pronunciation && !(firstNamePronunciation || lastNamePronunciation))
    );
    setLibraryOpened(!!(firstNamePronunciation || lastNamePronunciation));
  }, [visible]);

  return (
    <Column visible={visible}>
      <Row>
        {show(ShowComponents.Avatars) && (
          <Row left autoWidth>
            <Avatar name={name} src={avatarUrl} />
          </Row>
        )}
        <Row>
          <StyledText medium>{name}</StyledText>
        </Row>
      </Row>
      <StyledGap height={16} />
      <Row>
        <StyledText medium>
          {/* TODO: move to i18n */}
          My name recording
        </StyledText>
      </Row>
      <StyledGap height={8} />
      {recorderOpened && !libraryOpened && (
        <>
          {!showNotification && (
            <Row>
              <NewRecorder
                name={name}
                type={NameTypes.FullName}
                owner={owner}
                onRecorderClose={(option) => {
                  if (option === RecorderCloseOptions.CANCEL) {
                    onCancelClick();
                    setRecorderOpened(false);
                  } else if (option === RecorderCloseOptions.DELETE) {
                    setShowNotification(true);
                  }
                }}
                onSaved={() => {
                  onLibraryDelete().then(() => {
                    onSave();
                    setRecorderOpened(false);
                  });
                }}
                termsAndConditions={termsAndConditions}
                pronunciation={pronunciation}
                relativeSource={RelativeSource.RequesterSelf}
              />
            </Row>
          )}
          {showNotification && (
            <Row>
              <DeletedNotification
                onClose={() => {
                  onRecordingDelete().finally(() => {
                    setRecorderOpened(false);
                  });
                }}
                onRestore={() => {
                  setShowNotification(false);
                }}
                message={"You have deleted your recording."}
              />
            </Row>
          )}
          <StyledGap height={8} />
        </>
      )}
      {libraryOpened && (
        <>
          {!showLibraryNotification && (
            <LibraryRecordings
              firstName={firstName}
              lastName={lastName}
              firstNamePronunciation={firstNamePronunciation}
              lastNamePronunciation={lastNamePronunciation}
              owner={owner}
              name={name}
              onCancel={onCancelClick}
              onSaved={() => {
                onRecordingDelete().then(() => {
                  onSave();
                  setLibraryOpened(false);
                });
              }}
              onDelete={() => {
                setShowLibraryNotification(true);
              }}
            />
          )}
          {showLibraryNotification && (
            <Row>
              <DeletedNotification
                onClose={() => {
                  onLibraryDelete().finally(() => setLibraryOpened(false));
                }}
                onRestore={() => {
                  setShowLibraryNotification(false);
                }}
                message={"You have deleted preferred recordings."}
              />
              {/* TODO: move it ^^ to I18n */}
            </Row>
          )}
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
            <Button
              onClick={() => {
                onCancelClick();
              }}
            >
              {/* TODO: move to i18n */}
              Cancel
            </Button>
          </Row>
        </>
      )}
    </Column>
  );
};
