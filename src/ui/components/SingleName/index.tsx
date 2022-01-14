import React from "react";
import Name, { NameTypes } from "../../../types/resources/name";
import NameLine from "../NameLine";
import AbsentName from "../AbsentName";

import Pronunciation from "../../../types/resources/pronunciation";

interface Props {
  canRecordingRequestCreate: boolean;
  canUserResponse: boolean;
  canPronunciationCreate: boolean;
  openRecorder: (name, type) => void;
  reloadName: (type: NameTypes) => void;
  name: Name;
  pronunciations: Pronunciation[];
}

const SingleName = (props: Props): JSX.Element => {
  const { name, pronunciations } = props;

  return (
    <>
      {name.exist ? (
        <NameLine
          pronunciations={pronunciations}
          name={name.key}
          type={name.type}
          reload={props.reloadName}
          onRecorderClick={props.openRecorder}
          canRecord={props.canPronunciationCreate}
          canUserResponse={props.canUserResponse}
        />
      ) : (
        <AbsentName
          canRecordingRequestCreate={props.canRecordingRequestCreate}
          canPronunciationCreate={props.canPronunciationCreate}
          name={name.key}
          type={name.type}
        />
      )}
    </>
  );
};

export default SingleName;
