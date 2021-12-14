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
import NameLine from "../NameLine";
import Recorder from "../Recorder";
import ControllerContext from "../../contexts/controller";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import AbsentName from "../AbsentName";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";

interface Props {
  names: { [t in NameTypes]: Name };
  verifyNames: () => PromiseLike<void>;
  hideLogo?: boolean;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const Container = (props: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState(props.names.firstName as Name);
  const [lastName, setLastName] = useState(props.names.lastName as Name);
  const [fullName, setFullName] = useState(props.names.fullName as Name);

  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const { isOpen: isRecorderOpen } = recorderState;
  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();

  const canRecordingRequestCreate = useMemo(
    () => controller.permissions.can(Resources.RecordingRequest, "create"),
    [controller.permissions]
  );

  const canPronunciationCreate = useMemo(
    () => controller.permissions.can(Resources.Pronunciation, "create"),
    [controller.permissions]
  );

  const simpleSearch = async (type: NameTypes): Promise<void> => {
    updatePronunciationsByType(
      type,
      await controller.simpleSearch(props[type])
    );
  };

  const reloadName = async (type: NameTypes): Promise<void> => {
    if (type === NameTypes.LastName || type === NameTypes.FirstName)
      return await simpleSearch(type);
    else return await props.verifyNames();
  };

  const openRecorder = (name, type): void =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  const resetNameExist = (type, complexSearchResult) =>
    props.names[type]
      ? {
          ...props.names[type],
          exist: complexSearchResult[type].length > 0,
        }
      : {};

  const complexSearch = useCallback(async () => {
    const existedNames = Object.values(props.names).filter((n) => n.exist);

    if (existedNames.length === 0) return;

    const complexSearchResult = await controller.complexSearch(existedNames);

    setPronunciations(complexSearchResult);

    setFirstName(resetNameExist(NameTypes.FirstName, complexSearchResult));
    setLastName(resetNameExist(NameTypes.LastName, complexSearchResult));
    setFullName(resetNameExist(NameTypes.FullName, complexSearchResult));
  }, []);

  useEffect(() => {
    setLoading(true);
    complexSearch().then(() => setLoading(false));
  }, []);

  const getNameParts = () => {
    const parts = [firstName, lastName].filter((n) => n.key);
    if (parts.length > 0) return parts;

    return [fullName];
  };

  const renderNameHeader = () => {
    if (fullName && fullName.exist) {
      return (
        <span className={cx({ "name-word--secondary": !fullName.exist })}>
          {fullName.key}
        </span>
      );
    } else {
      return (
        <>
          {firstName.key && (
            <span className={cx({ "name-word--secondary": !firstName.exist })}>
              {`${firstName.key} `}
            </span>
          )}
          {lastName.key && (
            <span className={cx({ "name-word--secondary": !lastName.exist })}>
              {lastName.key}
            </span>
          )}
          {!(firstName.key || lastName.key) && (
            <span className={cx({ "name-word--secondary": !fullName.exist })}>
              {fullName.key}
            </span>
          )}
        </>
      );
    }
  };

  const nameParts = getNameParts();
  const isFullName = firstName.exist || lastName.exist;

  return (
    <>
      <div className={cx("head-line")}>
        {!props.hideLogo && <Logo />}

        <FullName
          name={fullName.key}
          pronunciations={pronunciations.fullName}
          canPronunciationCreate={canPronunciationCreate}
          isFullName={isFullName}
          reload={reloadName}
          onRecorderClick={openRecorder}
        >
          {renderNameHeader()}
        </FullName>
      </div>

      {!pronunciations.fullName?.[0]?.nameOwnerCreated && lastName && (
        <hr className={styles.divider} />
      )}

      {loading && lastName && <Loader inline />}

      {isRecorderOpen && !loading && (
        <Recorder
          name={recorderState.name}
          type={recorderState.type}
          onRecorderClose={setRecorderClosed}
          termsAndConditions={recorderState.termsAndConditions}
        />
      )}

      {!loading &&
        !isRecorderOpen &&
        !pronunciations.fullName?.[0]?.nameOwnerCreated && (
          <>
            {nameParts.map((name, index) => (
              <React.Fragment key={`${name.key}-${index}`}>
                {name.exist ? (
                  <NameLine
                    pronunciations={pronunciations[name.type]}
                    name={name.key}
                    type={name.type}
                    reload={reloadName}
                    onRecorderClick={openRecorder}
                  />
                ) : (
                  <AbsentName
                    canRecordingRequestCreate={canRecordingRequestCreate}
                    canPronunciationCreate={canPronunciationCreate}
                    name={name.key}
                    type={
                      !firstName.exist && !lastName.exist && !fullName.exist
                        ? NameTypes.FirstName
                        : name.type
                    }
                  />
                )}

                {index === 0 && nameParts.length > 1 && (
                  <hr className={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </>
        )}
    </>
  );
};

export default Container;
