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
import { AnalyticsEventType } from "../../../types/resources/analytics-event-type";
import SingleName from "../SingleName";
import CustomAttributes from "../CustomAttributes";

interface Props {
  names: { [t in NameTypes]: Name };
  verifyNames: () => PromiseLike<void>;
  hideLogo?: boolean;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const Container = (props: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState(props.names.firstName as Name);
  const [lastName, setLastName] = useState(props.names.lastName as Name);
  const [fullName, setFullName] = useState(props.names.fullName as Name);

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

  const canPronunciationCreate = useMemo(() => {
    return (
      controller.permissions.can(Resources.Pronunciation, "create") &&
      controller.permissions.can(Resources.Pronunciation, "index")
    );
  }, [controller.permissions]);

  const canPronunciationSearch = useMemo(() => {
    return controller.permissions.can(Resources.Pronunciation, "search");
  }, [controller.permissions]);

  const setNameExistByType = (type): void => {
    // eslint-disable-next-line prettier/prettier
    if (type === NameTypes.FirstName) setFirstName({ ...firstName, exist: true });
    if (type === NameTypes.LastName) setLastName({ ...lastName, exist: true });
    if (type === NameTypes.FullName) setFullName({ ...fullName, exist: true });
  };

  const simpleSearch = async (type: NameTypes): Promise<void> => {
    const simpleSearchResult = await controller.simpleSearch(props.names[type]);
    updatePronunciationsByType(type, simpleSearchResult);

    if (simpleSearchResult.length > 0) setNameExistByType(type);
  };

  const reloadName = async (type: NameTypes): Promise<void> => {
    if (type === NameTypes.LastName || type === NameTypes.FirstName)
      return await simpleSearch(type);
    else return await props.verifyNames();
  };

  const onRecorded = (): Promise<void> => {
    updatePronunciationsByType(recorderState.type, []);
    reloadName(recorderState.type);

    return Promise.resolve();
  };

  const openRecorder = (name, type): void =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  const resetNameExist = (type, complexSearchResult, stateCb): void => {
    const stateName = props.names[type];

    const refreshedExist = complexSearchResult[type].length > 0;

    if (stateName.exist !== refreshedExist) {
      stateCb({
        ...stateName,
        exist: refreshedExist,
      });
    }
  };

  const complexSearch = useCallback(async () => {
    const existedNames = Object.values(props.names).filter((n) => n.exist);

    if (existedNames.length === 0) return;

    const complexSearchResult = await controller.complexSearch(existedNames);

    setPronunciations(complexSearchResult);

    resetNameExist(NameTypes.FirstName, complexSearchResult, setFirstName);
    resetNameExist(NameTypes.LastName, complexSearchResult, setLastName);
    resetNameExist(NameTypes.FullName, complexSearchResult, setFullName);
  }, []);

  const sendAnalytics = (): PromiseLike<void> =>
    controller.sendAnalytics(
      AnalyticsEventType.Available,
      Object.values(props.names)
    );

  useEffect(() => {
    if (canPronunciationSearch) {
      complexSearch()
        .then(() => setLoading(false))
        .then(() => sendAnalytics())
        .catch((e) => console.log(e));
    } else {
      setLoading(false);
    }
  }, []);

  const isSingleName = !(lastName.key || fullName.key);

  const renderSingleNameHeader = () => (
    <>
      <div className={cx("head-line")}>
        {!props.hideLogo && <Logo />}
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

  const renderFullNameHeader = () => (
    <>
      <div className={cx("head-line")}>
        {!props.hideLogo && <Logo />}
        <FullName
          name={fullName.key}
          pronunciations={pronunciations.fullName}
          canPronunciationCreate={canPronunciationCreate}
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
      {pronunciations.fullName[0] &&
        pronunciations.fullName[0].customAttributes &&
        pronunciations.fullName[0].customAttributes.length > 0 && (
          <>
            <br />
            <CustomAttributes
              attributes={pronunciations.fullName[0].customAttributes}
              disabled
            />
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
              canPronunciationCreate={canPronunciationCreate}
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
                <>
                  <SingleName
                    canRecordingRequestCreate={canRecordingRequestCreate}
                    canRecordingRequestFind={canRecordingRequestFind}
                    canUserResponse={canUserResponse}
                    canPronunciationCreate={canPronunciationCreate}
                    openRecorder={openRecorder}
                    reloadName={reloadName}
                    name={name}
                    pronunciations={pronunciations[name.type]}
                  />
                  {index === 0 && <hr className={styles.divider} />}
                </>
              ))}
            </>
          )}
    </>
  );

  return (
    <>
      {isSingleName ? renderSingleNameHeader() : renderFullNameHeader()}
      {isRecorderOpen && !loading && (
        <Recorder
          name={recorderState.name}
          type={recorderState.type}
          onRecorderClose={setRecorderClosed}
          onRecorded={onRecorded}
          termsAndConditions={recorderState.termsAndConditions}
        />
      )}
      {canPronunciationSearch ? (
        renderContainer()
      ) : (
        <div className={cx(styles.permissions)}>
          You can't create or listen to any of libraray recordings. Please
          contact your administrator to get this fixed.
        </div>
      )}
    </>
  );
};

export default Container;
