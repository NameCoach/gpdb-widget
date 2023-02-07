import React from "react";
import MyInfo from "../MyInfo";
import { NameOwner } from "gpdb-api-client";
import { Column, Row } from "../../kit/Grid";
import ShareRecording from "../ShareRecording";
import { Speaker, Title } from "../shared/components";
import useTranslator from "../../hooks/useTranslator";
import Loader from "../Loader";
import { Avatar } from "../shared/components/Avatar";
import { StyledP, StyledText } from "../../kit/Topography";
import { Actions, AvatarEditor } from "./components";
import { DARKER_RED } from "../../styles/variables/colors";
import { Recorder } from "../NewRecorder";
import { LibraryRecordings } from "../LibraryRecordings";
import { Uploader } from "../Uploader";
import { CardIconButton } from "../../kit/Buttons";
import { Library, Mic, Upload } from "../../kit/NewIcons";
import { usePersonal } from "./hooks";

interface Props {
  name: string;
  owner: NameOwner;
}

export const PersonalSection = ({ name, owner }: Props): JSX.Element => {
  if (!name?.trim()) throw new Error("Name shouldn't be blank");

  const { t } = useTranslator();

  const {
    showPersonalBlock,
    showAvatars,
    canAvatars,
    showLibraryRecordings,
    showRecorder,
    showUploader,
    showLibraryEditor,
    pronunciation,
    libFNPronun,
    libLNPronun,
    tempFNPronun,
    tempLNPronun,
    loading,
    inEdit,
    firstName,
    lastName,
    avatarUrl,
    tempAvatarUrl,
    tempAvatarFile,
    libDeleted,
    recFailed,
    touched,
    showUnsavedTip,
    avatarError,
    openEdit,
    onEditClose,
    onEditSave,
    openRecorder,
    openUploader,
    openLibraryEditor,
    closeEditors,
    recOnDelete,
    recOnRecord,
    recOnFail,
    libOnDelete,
    libOnLNSelect,
    libOnFNSelect,
    avatarOnUpload,
    avatarOnDelete,
    avatarOnFail,
    load,
  } = usePersonal({
    name,
    owner,
  });

  return (
    <>
      {showPersonalBlock && (
        <Column>
          <Row padding={"20px 0"}>
            <Title>{t("my_info_section_name", "My Recording")}</Title>
            <ShareRecording loading={loading} pronunciation={pronunciation} />
          </Row>

          {loading && (
            <Row centered>
              <Loader />
            </Row>
          )}

          {!loading && (
            <Column gap={8}>
              <Row>
                {showAvatars && (
                  <Row left autoWidth flex={"0 0 auto"}>
                    <Avatar name={name} src={avatarUrl} />
                  </Row>
                )}
                <Row>
                  <StyledText medium>{name}</StyledText>
                </Row>
                <Actions
                  inEdit={inEdit}
                  pronunciation={pronunciation}
                  firstNamePronun={tempFNPronun}
                  lastNamePronun={tempLNPronun}
                  touched={touched}
                  onEdit={openEdit}
                  onSave={onEditSave}
                  onClose={onEditClose}
                />
              </Row>
              {!inEdit && (tempFNPronun || tempLNPronun) && (
                <>
                  <Row padding={"16px 0"}>
                    <StyledText medium>{firstName}</StyledText>
                    <Speaker pronunciation={libFNPronun} />
                  </Row>
                  <Row padding={"16px 0"}>
                    <StyledText medium>{lastName}</StyledText>
                    <Speaker pronunciation={libLNPronun} />
                  </Row>
                </>
              )}
              {inEdit && (
                <>
                  <Row visible={loading} centered>
                    <Loader />
                  </Row>
                  <Column gap={8} visible={!loading}>
                    <Row visible={showUnsavedTip}>
                      <StyledP color={DARKER_RED}>
                        Are you sure you don't want to save changes?
                      </StyledP>
                    </Row>
                    <Row padding="8px 0 0 0">
                      <StyledText medium>
                        {/* TODO: move to i18n */}
                        My name recording
                      </StyledText>
                    </Row>

                    {/* Editors */}
                    {showRecorder && (
                      <Recorder
                        pronunciation={pronunciation}
                        onDelete={recOnDelete}
                        onRecord={recOnRecord}
                        onFail={recOnFail}
                        onClose={closeEditors}
                      />
                    )}
                    {showLibraryEditor && (
                      <LibraryRecordings
                        owner={owner}
                        firstName={firstName}
                        lastName={lastName}
                        firstNamePronun={tempFNPronun}
                        lastNamePronun={tempLNPronun}
                        onClose={closeEditors}
                        onDelete={libOnDelete}
                        onFirstNameSelect={libOnFNSelect}
                        onLastNameSelect={libOnLNSelect}
                        deleted={libDeleted}
                      />
                    )}
                    {showUploader && (
                      <Uploader
                        onUpload={recOnRecord}
                        onClose={closeEditors}
                        recorderFailed={recFailed}
                      />
                    )}

                    {/* Editors openers Buttons */}
                    <Row>
                      {!showRecorder && (
                        <CardIconButton
                          onClick={openRecorder}
                          icon={Mic}
                          // TODO: move to i18n
                          text={"Record"}
                        />
                      )}
                      {!showLibraryEditor && showLibraryRecordings && (
                        <CardIconButton
                          onClick={openLibraryEditor}
                          icon={Library}
                          // TODO: move to i18n
                          text={"Library"}
                        />
                      )}
                      {!showUploader && (
                        <CardIconButton
                          onClick={openUploader}
                          icon={Upload}
                          // TODO: move to i18n
                          text={"Upload"}
                        />
                      )}
                    </Row>

                    {showAvatars && canAvatars && (
                      <AvatarEditor
                        name={name}
                        src={tempAvatarUrl}
                        tempFileName={tempAvatarFile?.name}
                        tempError={avatarError}
                        onUpload={avatarOnUpload}
                        onDelete={avatarOnDelete}
                        onFail={avatarOnFail}
                      />
                    )}
                  </Column>
                </>
              )}
            </Column>
          )}

          {pronunciation ? (
            <MyInfo
              name={name}
              owner={owner}
              pronunciation={pronunciation}
              onCustomAttributesSaved={load}
            />
          ) : null}
        </Column>
      )}
    </>
  );
};
