import React, { useCallback, useContext, useEffect, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import Recorder from "../Recorder";

import StyleContext from "../../contexts/style";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useOnRecorderClose from "../../hooks/MyInfo/useOnRecorderClose";
import MyRecording from "../MyRecording";
import MyInfo from "../MyInfo";

interface Props {
  name: Omit<NameOption, "key">;
  controller: IFrontController;
  termsAndConditions?: TermsAndConditions;
}

const PersonalBlock = (props: Props): JSX.Element => {
  if (!props?.name?.value?.trim()) throw new Error("Name shouldn't be blank");

  const styleContext = useContext(StyleContext);
  const customFeatures = useCustomFeatures(props.controller, styleContext);

  const { can, show } = useFeaturesManager(
    props.controller.permissions,
    customFeatures
  );

  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
  const [collapsableActive, setCollapsable] = useState(false);
  const [myInfoHintShow, setMyInfoHintShow] = useState(true);

  const showRecordAction = show("selfRecorderAction", pronunciation);
  const canCreateSelfRecording = can("createSelfRecording", pronunciation);
  const canSimpleSearch = can("pronunciation", "index");

  const load = useCallback(async () => {
    if (!canSimpleSearch) return;

    setLoading(true);
    const fullName = await props.controller.simpleSearch(
      {
        key: props.name.value,
        type: NameTypes.FullName,
      },
      props.name.owner
    );

    setPronunciation(fullName.find((p) => p.nameOwnerCreated));
    setLoading(false);
  }, [props.controller, props.name.owner, props.name.value]);

  const onRecorderOpen = (): void => {
    setRecorderOpen(
      true,
      props.name.value,
      NameTypes.FullName,
      props.termsAndConditions
    );

    if (myInfoHintShow) setMyInfoHintShow(false);

    if (collapsableActive) setCollapsable(false);
  };

  const onRecorderClose = useOnRecorderClose({
    controller: props.controller,
    customFeaturesManager: customFeatures,
    pronunciation: pronunciation,
    load: load,
    setLoading: setLoading,
    setRecorderClosed: setRecorderClosed,
    setPronunciation: setPronunciation,
    setMyInfoHintShow: setMyInfoHintShow,
  });

  const showMyInfo = show(
    "customAttributesForSelf",
    pronunciation,
    props.controller.customAttributes
  );

  const onCustomAttributesSaved = async (): Promise<void> => {
    await load();
    setMyInfoHintShow(true);
    setCollapsable(false);
  };

  useEffect(() => {
    load();
  }, [props.name, props.controller, load]);

  return (
    <>
      <MyRecording
        pronunciation={pronunciation}
        name={props.name}
        loading={loading}
        isRecorderOpen={recorderState.isOpen}
        onRecorderOpen={onRecorderOpen}
        showRecordAction={showRecordAction}
        canCreateSelfRecording={canCreateSelfRecording}
        myInfoHintShow={myInfoHintShow}
      />
      {recorderState.isOpen && (
        <Recorder
          name={props.name.value}
          type={NameTypes.FullName}
          owner={props.name.owner}
          onRecorderClose={onRecorderClose}
          termsAndConditions={props.termsAndConditions}
          pronunciation={pronunciation}
        />
      )}
      {showMyInfo && (
        <MyInfo
          name={props.name}
          controller={props.controller}
          pronunciation={pronunciation}
          onCustomAttributesSaved={onCustomAttributesSaved}
          loading={loading}
        />
      )}
    </>
  );
};

export default PersonalBlock;
