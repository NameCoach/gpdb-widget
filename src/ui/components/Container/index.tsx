import React, { useContext, useEffect, useMemo, useState } from "react";
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
  firstName: Name;
  lastName: Name;
  fullName: Name;
  verifyNames: () => PromiseLike<void>;
  hideLogo?: boolean;
  termsAndConditions?: TermsAndConditions;
}

const cx = classNames.bind(styles);

const Container = (props: Props) => {
  const controller = useContext(ControllerContext);
  const [loading, setLoading] = useState(false);
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();

  const { isOpen: isRecorderOpen } = recorderState;
  const { firstName, lastName, fullName } = props;
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

  const simpleSearch = async (type: NameTypes) => {
    updatePronunciationsByType(
      type,
      await controller.simpleSearch(props[type])
    );
  };

  const reloadName = async (type: NameTypes) => {
    if (type === NameTypes.LastName || type === NameTypes.FirstName)
      return await simpleSearch(type);
    else return await props.verifyNames();
  };

  const openRecorder = (name, type) =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  useEffect(() => {
    const complexSearch = async () => {
      const existedNames = [firstName, lastName, fullName].filter(
        (n) => n.exist
      );

      if (existedNames.length === 0) return;
      setLoading(true);
      setPronunciations(await controller.complexSearch(existedNames));
      setLoading(false);
    };

    complexSearch();
  }, [props.fullName, props.firstName, props.lastName]);

  return (
    <>
      <div className={cx("head-line")}>
        {!props.hideLogo && <Logo />}

        <FullName
          name={fullName.key}
          pronunciations={pronunciations.fullName}
          reload={reloadName}
          onRecorderClick={openRecorder}
        >
          <span className={cx({ "name-word--secondary": !firstName.exist })}>
            {`${firstName.key}, `}
          </span>
          <span className={cx({ "name-word--secondary": !lastName.exist })}>
            {lastName.key}
          </span>
        </FullName>
      </div>

      {!pronunciations.fullName?.[0]?.nameOwnerCreated && (
        <hr className={styles.divider} />
      )}

      {loading && <Loader />}

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
            {[firstName, lastName].map((name, index) => (
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
                    type={name.type}
                  />
                )}

                {index === 0 && <hr className={styles.divider} />}
              </React.Fragment>
            ))}
          </>
        )}
    </>
  );
};

export default Container;
