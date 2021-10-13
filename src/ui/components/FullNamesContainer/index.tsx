import React, { useEffect, useState } from "react";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import FullNamesList, { NameOption } from "../FullNamesList";
import Pronunciation from "../../../types/resources/pronunciation";
import Name, { NameTypes } from "../../../types/resources/name";
import { usePronunciations } from "../../hooks/pronunciations";
import NameLine from "../NameLine";
import AbsentName from "../AbsentName";
import styles from "../Container/styles.module.css";
import Recorder from "../Recorder";
import IFrontController from "../../../types/front-controller";
import { UserPermissions } from "../../../types/permissions";

interface Props {
  names: NameOption[];
  onSelect?: (NameOption) => void;
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions: UserPermissions;
}

const FullNamesContainer = (props: Props): JSX.Element => {
  const {
    pronunciations,
    setPronunciations,
    updatePronunciationsByType,
  } = usePronunciations();
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();
  const { isOpen: isRecorderOpen } = recorderState;
  const [currentPronunciation, setCurrent] = useState<Pronunciation>(null);
  const [loading, setLoading] = useState(false);
  const [nameParts, setNameParts] = useState<Name[]>([]);

  const getRequestedNames = async (
    result: { [t in NameTypes]: Pronunciation[] },
    names: { key: string; type: string }[]
  ): Promise<{ firstName: boolean; lastName: boolean }> => {
    const isRequested = async (pronunciations, name): Promise<boolean> => {
      if (pronunciations.length === 0) {
        const result = await props.controller.findRecordingRequest(
          name.key,
          name.type
        );

        return result;
      } else {
        return false;
      }
    };

    const firstName = names.filter((n) => n.type === NameTypes.FirstName)[0];
    const lastName = names.filter((n) => n.type === NameTypes.LastName)[0];

    return {
      firstName: await isRequested(result[NameTypes.FirstName], firstName),
      lastName: await isRequested(result[NameTypes.LastName], lastName),
    };
  };

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);

    if (props.permissions.canPronunciation.search) {
      const parsedNames = props.controller.nameParser.parse(name.value);
      const names = Object.values(NameTypes)
        .filter((type) => parsedNames[type])
        .map((type) => ({
          key: parsedNames[type],
          type,
        }));
      const result = await props.controller.complexSearch(names, name.owner);
      const _current = result.fullName[0];

      setCurrent(_current);

      if (_current) return setLoading(false);

      const _requestedNames = await getRequestedNames(result, names);

      setNameParts(
        names
          .filter((n) => n.type !== NameTypes.FullName)
          .map((name) => ({
            ...name,
            exist: result[name.type].length !== 0,
            isRequested: _requestedNames[name.type],
          }))
      );

      setPronunciations(result);

      setLoading(false);
    } else {
      const pronunciations = await props.controller.simpleSearch(
        {
          key: name.value,
          type: NameTypes.FullName,
        },
        name.owner
      );

      setCurrent(pronunciations[0]);
      setLoading(false);
    }
  };

  const onSelect = (name: NameOption): Promise<void> => {
    const owner = props.names.find((n) => n.key === name.key).owner;
    setNameParts([]);
    return loadName({ ...name, owner });
  };

  const reloadName = async (type: NameTypes): Promise<void> => {
    const pronunciations = await props.controller.simpleSearch(
      nameParts.find((n) => n.type === type)
    );

    updatePronunciationsByType(type, pronunciations);

    setNameParts(
      nameParts
        .filter((n) => n.type !== NameTypes.FullName)
        .map((name) => ({
          ...name,
          exist: name.type === type ? true : name.exist,
        }))
    );
  };

  const openRecorder = (name, type): void =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  useEffect(() => {
    loadName(props.names[0]);
  }, [props.names]);

  return (
    <>
      <FullNamesList
        names={props.names}
        onSelect={onSelect}
        value={currentPronunciation}
        loading={loading}
        hideActions={
          props.permissions.canPronunciation.search &&
          !currentPronunciation &&
          nameParts.length > 0
        }
      />

      {props.permissions.canPronunciation.search && !isRecorderOpen && (
        <>
          <br />
          {nameParts.map((name, index) => (
            <React.Fragment key={name.key}>
              {name.exist ? (
                <NameLine
                  pronunciations={pronunciations[name.type]}
                  name={name.key}
                  type={name.type}
                  reload={reloadName}
                  canRecord={props.permissions.canPronunciation.create}
                  canUserResponse={props.permissions.canUserResponse.create}
                  onRecorderClick={openRecorder}
                />
              ) : (
                <AbsentName
                  canRecordingRequestCreate={
                    props.permissions.canRecordingRequest.create
                  }
                  canPronunciationCreate={
                    props.permissions.canPronunciation.create
                  }
                  name={name.key}
                  type={name.type}
                  isRequested={name.isRequested}
                  onRecorderClick={openRecorder}
                />
              )}

              {index === 0 && <hr className={styles.divider} />}
            </React.Fragment>
          ))}
        </>
      )}

      {props.permissions.canPronunciation.search &&
        isRecorderOpen &&
        !loading && (
          <Recorder
            name={recorderState.name}
            type={recorderState.type}
            onRecorded={(): Promise<void> => reloadName(recorderState.type)}
            onRecorderClose={setRecorderClosed}
            termsAndConditions={recorderState.termsAndConditions}
          />
        )}
    </>
  );
};

export default FullNamesContainer;
