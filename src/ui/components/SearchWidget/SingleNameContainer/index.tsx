import React, { useEffect, useState } from "react";
import useRecorderState, {
  TermsAndConditions,
} from "../../../hooks/useRecorderState";
import { NameOption } from "../../FullNamesList";
import Name, { NameTypes } from "../../../../types/resources/name";
import NameLine from "../../NameLine";
import AbsentName from "../../AbsentName";
import Recorder from "../../Recorder";
import { Loader } from "../../../..";
import Pronunciation from "../../../../types/resources/pronunciation";
import IFrontController from "../../../../types/front-controller";
import { UserPermissions } from "../../../../types/permissions";

interface Props {
  name: NameOption;
  termsAndConditions?: TermsAndConditions;
  controller: IFrontController;
  permissions: UserPermissions;
}

const SingleNameContainer = (props: Props): JSX.Element => {
  const [
    recorderState,
    setRecorderClosed,
    setRecorderOpen,
  ] = useRecorderState();
  const { isOpen: isRecorderOpen } = recorderState;
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<Name>();
  const [pronunciations, setPronunciations] = useState<Pronunciation[]>([]);

  const getRequestedNames = async (
    result: Pronunciation[],
    name: { key: string; type: NameTypes }
  ): Promise<boolean> => {
    if (result.length === 0 && props.permissions.canRecordingRequest.find) {
      const result = await props.controller.findRecordingRequest(
        name.key,
        name.type
      );

      return result;
    } else {
      return false;
    }
  };

  const loadName = async (name: NameOption): Promise<void> => {
    setLoading(true);
    const pronunciations = await props.controller.simpleSearch(
      {
        key: name.value,
        type: NameTypes.FullName,
      },
      name.owner
    );

    setPronunciations(pronunciations);

    const _requestedName = await getRequestedNames(pronunciations, {
      key: name.key,
      type: NameTypes.FirstName,
    });

    setName({
      key: name.key,
      type: NameTypes.FirstName,
      exist: pronunciations.length !== 0,
      isRequested: _requestedName,
    });

    setLoading(false);
  };

  const openRecorder = (name, type): void =>
    setRecorderOpen(true, name, type, props.termsAndConditions);

  useEffect(() => {
    loadName(props.name);
  }, [props.name]);

  return (
    <>
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      {!isRecorderOpen && name && (
        <>
          <br />
          <React.Fragment key={name.key}>
            {name.exist ? (
              <NameLine
                pronunciations={pronunciations}
                name={name.key}
                type={name.type}
                reload={(): Promise<void> => loadName(props.name)}
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
          </React.Fragment>
        </>
      )}

      {isRecorderOpen && !loading && (
        <Recorder
          name={recorderState.name}
          type={recorderState.type}
          onRecorded={(): Promise<void> => loadName(props.name)}
          onRecorderClose={setRecorderClosed}
          termsAndConditions={recorderState.termsAndConditions}
        />
      )}
    </>
  );
};

export default SingleNameContainer;
