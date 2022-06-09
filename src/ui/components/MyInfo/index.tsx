import React, { useContext, useEffect, useState } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Pronunciation from "../../../types/resources/pronunciation";
import { NameTypes } from "../../../types/resources/name";
import Loader from "../Loader";
import Player from "../Player";
import RecordAction from "../Actions/Record";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import Recorder from "../Recorder";
import { UserPermissions } from "../../../types/permissions";
import ShareAudioUrlAction, { CopyButton } from "../Actions/ShareAudioUrl";
import CustomAttributes from "../CustomAttributes";
import CollapsableAction from "../Actions/Collapsable";
import DisabledPlayer from "../Player/Disabled";
import StyleContext from "../../contexts/style";
import { useNotifications } from "../../hooks/useNotification";
import { RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY } from "../../../constants";
import loadCustomFeatures from "../../hooks/loadCustomFatures";
import { RecorderCloseOptions } from "../Recorder/types/handlersTypes";
import { ConstantOverrides, Features } from "../../customFeaturesManager";
import useOnRecorderCloseStrategy from "../../hooks/MyInfo/useOnRecorderCloseStrategy";
import useFeaturesManager from "../../hooks/useFeaturesManager";

interface Props {
  name: Omit<NameOption, "key">;
  permissions: UserPermissions;
  controller: IFrontController;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const MyInfo = (props: Props): JSX.Element => {
  if (!props.name.value.trim()) throw new Error("Name shouldn't be blank");

  const { setNotification } = useNotifications();

  const [pronunciation, setPronunciation] = useState<Pronunciation>();
  const [loading, setLoading] = useState(true);
  const [collapsableActive, setCollapsable] = useState(false);
  const [myInfoHintShow, setMyInfoHintShow] = useState(true);
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const styleContext = useContext(StyleContext);
  const customFeatures =
    styleContext.customFeatures ||
    loadCustomFeatures(props.controller?.preferences?.custom_features);
  const t = styleContext.t;

  const { can, show } = useFeaturesManager(
    props.controller.permissions,
    customFeatures
  );

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

  const onCollapsable = (): void => {
    setMyInfoHintShow(collapsableActive);
    setCollapsable((value) => !value);

    if (recorderState.isOpen) setRecorderClosed();
  };

  const load = React.useCallback(async () => {
    if (!props.permissions.canPronunciation.index) return;

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
  }, [
    props.controller,
    props.name.owner,
    props.name.value,
    props.permissions.canPronunciation.index,
  ]);

  const run = useOnRecorderCloseStrategy({
    controller: props.controller,
    customFeaturesManager: customFeatures,
    pronunciation: pronunciation,
    autoclose:
      customFeatures.getValue(ConstantOverrides.RestorePronunciationTime) ||
      RESTORE_PRONUNCIATION_AUTOCLOSE_DELAY,
    load: load,
    setNotification: setNotification,
    setLoading: setLoading,
    setRecorderClosed: setRecorderClosed,
    setPronunciation: setPronunciation,
    setMyInfoHintShow: setMyInfoHintShow,
  });

  const onRecorderClose = async (
    option: RecorderCloseOptions
  ): Promise<void> => {
    setMyInfoHintShow(true);

    await run(option);
  };

  const onCustomAttributesSaved = async (): Promise<void> => {
    await load();
    setMyInfoHintShow(true);
    setCollapsable(false);
  };

  const getCopyButtons = (pronunciation): CopyButton[] => {
    const result = [];

    const share_urls = customFeatures.getMetadata(Features.Share)["available_urls"];

    if (share_urls.includes("defaultAudio"))
      result.push({ url: pronunciation.audioSrc, text: "Audio URL" });

    if (share_urls.includes("nameBadge") && pronunciation.nameBadgeLink)
      result.push({ url: pronunciation.nameBadgeLink, text: "NameBadge Link" });

    return result;
  };

  const displayCustomAttributes = (): boolean => {
    const customAttributesConfig = props.controller?.customAttributes;

    const dataPresent =
      pronunciation &&
      pronunciation.customAttributes &&
      pronunciation.customAttributes.length > 0;

    const configPresent =
      customAttributesConfig && customAttributesConfig.length > 0;
    const permissionsPresent = props.permissions.canCustomAttributes.saveValues;

    return (
      dataPresent || (pronunciation && configPresent && permissionsPresent)
    );
  };

  const customAttributesDisabled = (): boolean => {
    console.log(
      props.permissions.canCustomAttributes.saveValues,
      props.permissions.canCustomAttributes.retrieveConfig,
      pronunciation?.isHedb
    );
    return (
      !props.permissions.canCustomAttributes.saveValues ||
      !props.permissions.canCustomAttributes.retrieveConfig ||
      pronunciation?.isHedb
    );
  };

  const showRecordAction = show("selfRecorderAction", pronunciation);
  const canCreateSelfRecording = can("createSelfRecording", pronunciation);

  useEffect(() => {
    load();
  }, [props.name, props.controller, load]);

  return (
    <>
      <div>
        <div className={cx(styles.row)}>
          <span className={cx(styles.title, styles.m_10)}>
            {t("my_info_section_name", "My Info")}
          </span>

          <div className={cx(styles.actions)}>
            {loading && <Loader />}

            {!loading &&
              customFeatures.getValue(Features.Share) &&
              pronunciation && (
                <ShareAudioUrlAction buttons={getCopyButtons(pronunciation)} />
              )}

            {!loading && displayCustomAttributes() && (
              <CollapsableAction
                active={collapsableActive}
                onClick={onCollapsable}
              />
            )}

            {!loading && pronunciation && (
              <Player
                audioSrc={pronunciation.audioSrc}
                audioCreator={pronunciation.audioCreator}
              />
            )}

            {!loading && !pronunciation && <DisabledPlayer />}

            {!loading && showRecordAction && (
              <RecordAction
                active={recorderState.isOpen}
                onClick={onRecorderOpen}
                rerecord={!!pronunciation}
              />
            )}
          </div>
        </div>

        {!loading &&
          !pronunciation &&
          canCreateSelfRecording &&
          myInfoHintShow && (
            <div className={styles.unavailable_hint}>
              Your name recording is unavailable, click on the microphone icon
              to record your name
            </div>
          )}

        {pronunciation?.phoneticSpelling && (
          <div className={styles.phonetic}>
            {pronunciation.phoneticSpelling}
          </div>
        )}
      </div>

      {!loading && displayCustomAttributes() && collapsableActive && (
        <CustomAttributes
          attributes={pronunciation?.customAttributes}
          owner={props.name.owner}
          disabled={customAttributesDisabled()}
          onCustomAttributesSaved={onCustomAttributesSaved}
          onBack={onCollapsable}
          noBorder
        />
      )}

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
    </>
  );
};

export default MyInfo;
