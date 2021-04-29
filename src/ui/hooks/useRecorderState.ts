import { useState } from "react";
import { NameTypes } from "../../types/resources/name";

export type RecorderState = {
  isOpen: boolean;
  name: string | null;
  type: NameTypes | null;
};

export type SetRecorderState = (
  isOpen: boolean,
  name?: string,
  type?: NameTypes
) => void;

function useRecorderState(
  defaultState = {
    isOpen: false,
    name: null,
    type: null,
  }
) {
  const [recorderState, addState] = useState<RecorderState>(defaultState);

  const setRecorderOpen: SetRecorderState = (
    isOpen: boolean,
    name: string,
    type: NameTypes
  ) => addState({ name, type, isOpen });

  const setRecorderClosed = () =>
    addState({ name: null, type: null, isOpen: false });

  return [recorderState, setRecorderClosed, setRecorderOpen] as const;
}

export default useRecorderState;
