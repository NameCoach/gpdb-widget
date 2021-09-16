import React, { useContext, useEffect, useMemo, useState } from "react";
import useRecorderState, {
  TermsAndConditions,
} from "../../hooks/useRecorderState";
import FullNamesList, { NameOption } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import Pronunciation from "../../../types/resources/pronunciation";
import { Resources } from "gpdb-api-client/build/main/types/repositories/permissions";
import Name, { NameTypes } from "../../../types/resources/name";
import { usePronunciations } from "../../hooks/pronunciations";
import NameLine from "../NameLine";
import AbsentName from "../AbsentName";
import styles from "../Container/styles.module.css";
import Recorder from "../Recorder";

interface Props {
  names: NameOption[];
  onSelect?: (NameOption) => void;
  termsAndConditions?: TermsAndConditions;
}

const FullNamesContainer = (props: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
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

  const canComplexSearch = useMemo(
    () => controller.permissions.can(Resources.Pronunciation, "search"),
    [controller.permissions]
  );
  const canUserResponse = useMemo(
    () => controller.permissions.can(Resources.UserResponse, "create"),
    [controller.permissions]
  );

  const canRecord = useMemo(
    () => controller.permissions.can(Resources.Pronunciation, "create"),
    [controller.permissions]
  );

  const canRecordingRequestCreate = useMemo(
    () => controller.permissions.can(Resources.RecordingRequest, "create"),
    [controller.permissions]
  );

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);

    if (canComplexSearch) {
      const parsedNames = controller.nameParser.parse(name.value);
      const names = Object.values(NameTypes)
        .filter((type) => parsedNames[type])
        .map((type) => ({
          key: parsedNames[type],
          type,
        }));
      const result = await controller.complexSearch(names, name.owner);
      const _current = result.fullName[0];

      setCurrent(_current);
      setLoading(false);

      if (_current) return;

      setNameParts(
        names
          .filter((n) => n.type !== NameTypes.FullName)
          .map((name) => ({
            ...name,
            exist: result[name.type].length !== 0,
          }))
      );
      setPronunciations(result);
    } else {
      const pronunciations = await controller.simpleSearch(
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
    const pronunciations = await controller.simpleSearch(
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
          canComplexSearch && !currentPronunciation && nameParts.length > 0
        }
      />

      {canComplexSearch && !isRecorderOpen && (
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
                  canRecord={canRecord}
                  canUserResponse={canUserResponse}
                  onRecorderClick={openRecorder}
                />
              ) : (
                <AbsentName
                  canRecordingRequestCreate={canRecordingRequestCreate}
                  canPronunciationCreate={canRecord}
                  name={name.key}
                  type={name.type}
                  onRecorderClick={openRecorder}
                />
              )}

              {index === 0 && <hr className={styles.divider} />}
            </React.Fragment>
          ))}
        </>
      )}

      {canComplexSearch && isRecorderOpen && !loading && (
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
