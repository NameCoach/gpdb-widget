import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./styles.module.css";
import Name, { NameTypes } from "../../../types/resources/name";
import classNames from "classnames/bind";
import { usePronunciations } from "../../hooks/pronunciations";
import Loader from "../Loader";
import FullName from "../FullName";
import Logo from "../Logo";
import Recorder from "../Recorder";
import ControllerContext from "../../contexts/controller";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import SingleName from "../SingleName";
import useFeaturesManager, {
  CanComponents,
} from "../../hooks/useFeaturesManager";
import MyInfo from "../MyInfo";
import CustomAttributesInspector from "../Outlook/CustomAttributesInspector";
import { NameOption } from "../FullNamesList";
import StyleContext from "../../contexts/style";
import { Theme } from "../../../types/style-context";
import Analytics from "../../../analytics";
import { RecorderCloseOptions } from "../Recorder/types/handlers-types";
import Pronunciation from "../../../types/resources/pronunciation";
import { Components } from "../../../analytics/types";

interface Props {
  names: { [t in NameTypes]: Name };
  verifyNames: () => PromiseLike<void>;
  hideLogo?: boolean;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const Container = ({
  names,
  verifyNames,
  hideLogo,
  termsAndConditions,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const [loading, setLoading] = useState(true);
  const [fullNameOption, setFullNameOption] = useState<NameOption>({
    value: names.fullName.key,
    key: names.fullName.key,
  });
  const [firstName, setFirstName] = useState(names.firstName as Name);
  const [lastName, setLastName] = useState(names.lastName as Name);
  const [fullName, setFullName] = useState(names.fullName as Name);

  const { can } = useFeaturesManager();

  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();
  const fullNamePronunciation = pronunciations.fullName[0];

  const { isOpen: isRecorderOpen } = recorderState;

  const canRecordingRequestCreate = useMemo(() => {
    return controller.permissions.can(Resources.RecordingRequest, "create");
  }, [controller.permissions]);

  const canRecordingRequestFind = useMemo(() => {
    return controller.permissions.can(Resources.RecordingRequest, "find");
  }, [controller.permissions]);

  const canUserResponse = useMemo(() => {
    return controller.permissions.can(Resources.UserResponse, "create");
  }, [controller.permissions]);

  const canRecordOrgPeer = useMemo(
    () =>
      can(
        CanComponents.CreateOrgPeerRecording,
        controller.nameOwnerContext.signature
      ),
    [controller.nameOwnerContext.signature, controller.permissions]
  );

  const canCreateFullName = useMemo(() => {
    if (controller.isUserOwnsName())
      return can(CanComponents.CreateSelfRecording, fullNamePronunciation);

    // TODO: make that a named attribute of pronunciations object? INT-164
    if (fullNamePronunciation?.nameOwnerCreated) return false;

    return canRecordOrgPeer;
  }, [
    controller.nameOwnerContext,
    controller.permissions,
    fullNamePronunciation,
  ]);

  const canPronunciationSearch = useMemo(() => {
    return controller.permissions.can(Resources.Pronunciation, "search");
  }, [controller.permissions]);

  const setNameExistByType = (type): void => {
    // eslint-disable-next-line prettier/prettier
    if (type === NameTypes.FirstName) setFirstName({ ...firstName, exist: true });
    if (type === NameTypes.LastName) setLastName({ ...lastName, exist: true });
    if (type === NameTypes.FullName) setFullName({ ...fullName, exist: true });
    setFullNameOption({ value: names.fullName.key, key: names.fullName.key });
  };

  const simpleSearch = async (type: NameTypes): Promise<void> => {
    const simpleSearchResult = await controller.simpleSearch(names[type]);
    updatePronunciationsByType(type, simpleSearchResult);

    if (simpleSearchResult.length > 0) setNameExistByType(type);
  };

  const reloadName = async (type: NameTypes): Promise<void> => {
    if (type === NameTypes.LastName || type === NameTypes.FirstName)
      return await simpleSearch(type);
    else return await verifyNames();
  };

  const onRecorderClose = async (
    option: RecorderCloseOptions
  ): Promise<void> => {
    if (option !== RecorderCloseOptions.CANCEL) {
      updatePronunciationsByType(recorderState.type, []);
      await reloadName(recorderState.type);
    }

    setRecorderClosed();
  };

  const openRecorder = (
    name: string,
    type: NameTypes,
    pronunciation?: Pronunciation
  ): void => setRecorderOpen({ name, type, termsAndConditions, pronunciation });

  const resetNameExist = (type, complexSearchResult, stateCb): void => {
    const stateName = names[type];

    const refreshedExist = complexSearchResult[type].length > 0;

    if (stateName.exist !== refreshedExist) {
      stateCb({
        ...stateName,
        exist: refreshedExist,
      });
    }
  };

  const complexSearch = useCallback(async () => {
    const existedNames = Object.values(names).filter((n) => n.exist);

    if (existedNames.length === 0) return;

    const complexSearchResult = await controller.complexSearch(existedNames);

    setPronunciations(complexSearchResult);

    resetNameExist(NameTypes.FirstName, complexSearchResult, setFirstName);
    resetNameExist(NameTypes.LastName, complexSearchResult, setLastName);
    resetNameExist(NameTypes.FullName, complexSearchResult, setFullName);
  }, []);

  const { sendAnalyticsEvent } = Analytics.useAnalytics();

  const sendAnalytics = () =>
    sendAnalyticsEvent(Analytics.AnalyticsEventTypes.Common.Available);

  useEffect(() => {
    if (canPronunciationSearch) {
      complexSearch()
        .then(() => setLoading(false))
        .then(() => sendAnalytics())
        .catch((e) => console.log(e));
    } else {
      setLoading(false);
    }
    return (): void => {
      setLoading(true);
    };
  }, []);

  const isSingleName = !(lastName.key || fullName.key);

  const renderSingleNameHeader = (): JSX.Element => (
    <>
      <div className={cx("head-line")}>
        {!hideLogo && <Logo />}
        <div className={styles.head}>
          <div className={styles.head__names}>
            <span className={cx({ "name-word--secondary": !firstName.exist })}>
              {firstName.key}
            </span>
          </div>
        </div>
      </div>
      <hr className={styles.divider} />
    </>
  );
  const renderFullNameHeader = (): JSX.Element => (
    <>
      <div className={cx("head-line")}>
        {!hideLogo && <Logo />}
        <FullName
          name={fullName.key}
          pronunciations={pronunciations.fullName}
          canPronunciationCreate={canCreateFullName}
          reload={reloadName}
          onRecorderClick={openRecorder}
        >
          {fullName && fullName.exist ? (
            <span className={cx({ "name-word--secondary": !fullName.exist })}>
              {fullName.key}
            </span>
          ) : (
            <>
              <span
                className={cx({ "name-word--secondary": !firstName.exist })}
              >
                {`${firstName.key} `}
              </span>
              <span className={cx({ "name-word--secondary": !lastName.exist })}>
                {lastName.key}
              </span>
            </>
          )}
        </FullName>
      </div>
      {!pronunciations.fullName?.[0]?.nameOwnerCreated && (
        <hr className={styles.divider} />
      )}
      {!isRecorderOpen && pronunciations.fullName?.[0]?.nameOwnerCreated && (
        <>
          {controller.isUserOwnsName() ? (
            <MyInfo
              name={fullNameOption.value}
              owner={fullNameOption.owner}
              pronunciation={fullNamePronunciation}
              onCustomAttributesSaved={() => reloadName(fullName.type)}
            />
          ) : (
            <CustomAttributesInspector
              data={fullNamePronunciation.customAttributes}
              pronunciation={fullNamePronunciation}
            />
          )}
        </>
      )}
      {loading && <Loader inline />}
    </>
  );

  const renderContainer = (): JSX.Element => (
    <>
      {isSingleName
        ? !isRecorderOpen && (
            <SingleName
              canRecordingRequestCreate={canRecordingRequestCreate}
              canRecordingRequestFind={canRecordingRequestFind}
              canUserResponse={canUserResponse}
              canPronunciationCreate={canRecordOrgPeer}
              openRecorder={openRecorder}
              reloadName={reloadName}
              name={firstName}
              pronunciations={pronunciations[NameTypes.FirstName]}
            />
          )
        : !loading &&
          !isRecorderOpen &&
          !pronunciations.fullName?.[0]?.nameOwnerCreated && (
            <>
              {[firstName, lastName].map((name, index) => (
                <React.Fragment key={name.type + index}>
                  <SingleName
                    canRecordingRequestCreate={canRecordingRequestCreate}
                    canRecordingRequestFind={canRecordingRequestFind}
                    canUserResponse={canUserResponse}
                    canPronunciationCreate={canRecordOrgPeer}
                    openRecorder={openRecorder}
                    reloadName={reloadName}
                    name={name}
                    pronunciations={pronunciations[name.type]}
                  />
                  {index === 0 && <hr className={styles.divider} />}
                </React.Fragment>
              ))}
            </>
          )}
    </>
  );

  return (
    <>
      {isSingleName ? renderSingleNameHeader() : renderFullNameHeader()}
      {isRecorderOpen && !loading && (
        <StyleContext.Provider
          value={{ displayRecorderSavingMessage: true, theme: Theme.Outlook }}
        >
          <Analytics.Provider
            value={{
              pronunciation: recorderState.pronunciation,
              name: { value: recorderState.name, type: recorderState.type },
              component: (() => {
                if (recorderState.type === NameTypes.FullName)
                  return Components.FULLNAMELINE;

                if (pronunciations[recorderState.type].length > 0)
                  return Components.NAMELINE;

                return Components.ABSENT_NAME;
              })(),
            }}
          >
            <Recorder
              name={recorderState.name}
              type={recorderState.type}
              onRecorderClose={onRecorderClose}
              termsAndConditions={recorderState.termsAndConditions}
            />
          </Analytics.Provider>
        </StyleContext.Provider>
      )}
      {canPronunciationSearch ? (
        renderContainer()
      ) : (
        <div className={cx(styles.permissions)}>
          You can't create or listen to any of library recordings. Please
          contact your administrator to get this fixed.
        </div>
      )}
    </>
  );
};

export default Container;
