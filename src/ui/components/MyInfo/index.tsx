import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import ShareAudioUrlAction, { CopyButton } from "../Actions/ShareAudioUrl";
import CustomAttributes from "../CustomAttributes";
import CollapsableAction from "../Actions/Collapsable";
import DisabledPlayer from "../Player/Disabled";
import StyleContext from "../../contexts/style";
import { Features } from "../../customFeaturesManager";
import useFeaturesManager from "../../hooks/useFeaturesManager";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";
import useOnRecorderClose from "../../hooks/MyInfo/useOnRecorderClose";

interface Props {
  name: Omit<NameOption, "key">;
  controller: IFrontController;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const MyInfo = (props: Props): JSX.Element => {
  if (!props?.name?.value?.trim()) throw new Error("Name shouldn't be blank");

  const styleContext = useContext(StyleContext);

  const customFeatures = useCustomFeatures(props.controller, styleContext);
  const t = useTranslator(props.controller, styleContext);

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

  const showCustomAttributes = show(
    "customAttributesForSelf",
    pronunciation,
    props.controller.customAttributes
  );
  const customAttributesDisabled = !can("editCustomAttributesForSelf");

  const showRecordAction = show("selfRecorderAction", pronunciation);
  const canCreateSelfRecording = can("createSelfRecording", pronunciation);
  const canSimpleSearch = can("pronunciation", "index");

  const copyButtons = useMemo((): CopyButton[] => {
    if (!pronunciation) return;

    // eslint-disable-next-line
    const share_urls: Array<string> = customFeatures.getMetadata(Features.Share)["available_urls"];

    return share_urls
      .map((item) => {
        if (item === "defaultAudio" && pronunciation.audioSrc)
          return { url: pronunciation.audioSrc, text: "Audio URL" };

        if (item === "nameBadge" && pronunciation.nameBadgeLink) {
          console.warn("link", pronunciation.nameBadgeLink);
          return { url: pronunciation.nameBadgeLink, text: "NameBadge Link" };
        }
      })
      .filter((item) => item);
  }, [pronunciation, customFeatures]);

  const showSharePronunciationFeature = useMemo(
    () =>
      customFeatures.getValue(Features.Share) &&
      pronunciation &&
      copyButtons?.length > 0,
    [pronunciation, customFeatures]
  );

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

  const onCollapsable = (): void => {
    setMyInfoHintShow(collapsableActive);
    setCollapsable((value) => !value);

    if (recorderState.isOpen) setRecorderClosed();
  };

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
      <div>
        <div className={cx(styles.row)}>
          <span className={cx(styles.title, styles.m_10)}>
            {t("my_info_section_name", "My Info")}
          </span>

          <div className={cx(styles.actions)}>
            {loading && <Loader />}

            {!loading && showSharePronunciationFeature && (
              <ShareAudioUrlAction buttons={copyButtons} />
            )}

            {!loading && showCustomAttributes && (
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

      {!loading && showCustomAttributes && collapsableActive && (
        <CustomAttributes
          attributes={pronunciation?.customAttributes}
          owner={props.name.owner}
          disabled={customAttributesDisabled}
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
