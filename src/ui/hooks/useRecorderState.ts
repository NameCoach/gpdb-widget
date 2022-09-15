import { useState } from "react";
import { NameTypes } from "../../types/resources/name";

export type TermsAndConditions = {
  component: JSX.Element;
  isAccepted(): Promise<boolean>;
  onAccept(): Promise<void>;
};

export type RecorderState = {
  isOpen: boolean;
  name: string | null;
  type: NameTypes | null;
  termsAndConditions: TermsAndConditions | null;
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
    termsAndConditions: null,
  }
) {
  const [recorderState, addState] = useState<RecorderState>(defaultState);

  const setRecorderOpen: (
    isOpen: boolean,
    name: string,
    type: NameTypes,
    termsAndConditions: TermsAndConditions
  ) => void = (
    isOpen: boolean,
    name: string,
    type: NameTypes,
    termsAndConditions: TermsAndConditions
  ) => addState({ name, type, isOpen, termsAndConditions });

  const setRecorderClosed = () =>
    addState({
      name: null,
      type: null,
      isOpen: false,
      termsAndConditions: null,
    });

  return [recorderState, setRecorderClosed, setRecorderOpen] as const;
}

export default useRecorderState;
