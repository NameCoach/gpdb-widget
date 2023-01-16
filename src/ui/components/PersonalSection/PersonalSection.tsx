import React, { useCallback, useContext, useEffect, useState } from "react";
import IFrontController from "../../../types/front-controller";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";

import StyleContext from "../../contexts/style";
import useFeaturesManager, {
  ShowComponents,
} from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import MyInfo from "../MyInfo";
import ControllerContext from "../../contexts/controller";
import { NameOwner } from "gpdb-api-client";
import { Column, Row } from "../../kit/Grid";
import ShareRecording from "../ShareRecording";
import { Title } from "../shared/components";
import useTranslator from "../../hooks/useTranslator";
import { MyRecPresenter } from "./components";
import { MyRecEditor } from "./components/MyRecEditor";
import nameToKeyTypeObjectsArray from "../../../core/utils/name-to-key-type-objects-array";
import Loader from "../Loader";

interface Props {
  name: string;
  owner: NameOwner;
  termsAndConditions?: TermsAndConditions;
}

export const PersonalSection = ({
  name,
  owner,
  termsAndConditions,
}: Props): JSX.Element => {
  if (!name?.trim()) throw new Error("Name shouldn't be blank");

  const { t } = useTranslator();
  const styleContext = useContext(StyleContext);
  const controller = useContext<IFrontController>(ControllerContext);
  const customFeatures = useCustomFeatures(controller, styleContext);

  const { can, show } = useFeaturesManager(
    controller.permissions,
    customFeatures
  );

  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const [pronunciation, setPronunciation] = useState<Pronunciation>(null);
  const [loading, setLoading] = useState(true);
  const [myInfoHintShow, setMyInfoHintShow] = useState(true);

  const showRecordAction = show("selfRecorderAction", pronunciation);
  const canCreateSelfRecording = can("createSelfRecording", pronunciation);
  const canSimpleSearch = can("pronunciation", "index");

  const [firstName, setFirstName] = useState<string>(null);
  const [
    firstNamePronunciation,
    setFirstNamePronunciation,
  ] = useState<Pronunciation>(null);
  const [lastName, setLastName] = useState<string>(null);
  const [
    lastNamePronunciation,
    setLastNamePronunciation,
  ] = useState<Pronunciation>(null);
  const [inEdit, setInEdit] = useState<boolean>(false);

  const loadPreferredLibRecs = useCallback(async () => {
    if (!show(ShowComponents.LibraryRecordings)) return;
    if (!canSimpleSearch) return;

    const names = nameToKeyTypeObjectsArray(name, controller.nameParser).filter(
      (name) => name.type !== NameTypes.FullName
    );

    setFirstName(names.find((name) => name.type === NameTypes.FirstName).key);
    setLastName(names.find((name) => name.type === NameTypes.LastName).key);

    const result = await controller.getPreferredRecordings();

    setFirstNamePronunciation(result.firstNamePronunciation);
    setLastNamePronunciation(result.lastNamePronunciation);
  }, [controller, owner, name]);

  const load = useCallback(async () => {
    if (!canSimpleSearch) return;

    setLoading(true);
    const fullName = await controller.simpleSearch(
      {
        key: name,
        type: NameTypes.FullName,
      },
      owner
    );

    setPronunciation(fullName.find((p) => p.nameOwnerCreated));

    await loadPreferredLibRecs();

    setLoading(false);
  }, [controller, owner, name]);

  const onRecorderOpen = (): void => {
    setRecorderOpen(true, name, NameTypes.FullName, termsAndConditions);

    if (myInfoHintShow) setMyInfoHintShow(false);
  };

  const onCustomAttributesSaved = async (): Promise<void> => {
    await load();
    setMyInfoHintShow(true);
  };

  const onRecordingDelete = async (): Promise<void> => {
    if (!pronunciation) return;
    
    setLoading(true);

    await controller
      .destroy(
        pronunciation.id,
        pronunciation.sourceType,
        pronunciation.relativeSource
      )
      .then(load)
      .catch((e) => {
        console.log(e, e.details);
      });
  };

  const onLibraryDelete = async (): Promise<void> => {
    if (!firstNamePronunciation && !lastNamePronunciation) return;
    
    setLoading(true);

    await controller
      .deletePreferredRecordings({
        firstNamePronunciation: firstNamePronunciation,
        lastNamePronunciation: lastNamePronunciation,
      })
      .then(load)
      .then(() => setLoading(false))
      .catch((e) => {
        console.log(e, e.details);
      });
  };

  useEffect(() => {
    load();
  }, [name, controller, load]);

  return (
    <>
      {show(ShowComponents.PersonalBlock) && (
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
            <MyRecEditor
              name={name}
              pronunciation={pronunciation}
              firstName={firstName}
              firstNamePronunciation={firstNamePronunciation}
              lastName={lastName}
              lastNamePronunciation={lastNamePronunciation}
              owner={owner}
              termsAndConditions={termsAndConditions}
              onRecorderOpen={onRecorderOpen}
              onCancelClick={() => {
                setInEdit(false);
              }}
              onSave={() => {
                setInEdit(false);
                load();
              }}
              onRecordingDelete={onRecordingDelete}
              onLibraryDelete={onLibraryDelete}
              visible={inEdit}
            />
          )}
          {!loading && (
            <MyRecPresenter
              name={name}
              pronunciation={pronunciation}
              firstName={firstName}
              firstNamePronunciation={firstNamePronunciation}
              lastName={lastName}
              lastNamePronunciation={lastNamePronunciation}
              onEditClick={() => {
                setInEdit(true);
              }}
              visible={!inEdit}
            />
          )}

          {pronunciation ? (
            <MyInfo
              name={name}
              owner={owner}
              pronunciation={pronunciation}
              onCustomAttributesSaved={onCustomAttributesSaved}
            />
          ) : null}
        </Column>
      )}
    </>
  );
};
