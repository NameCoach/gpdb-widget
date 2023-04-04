import { useState } from "react";
import { NameTypes } from "../../types/resources/name";
import Pronunciation from "../../types/resources/pronunciation";

export type TermsAndConditions = {
  component: JSX.Element;
  isAccepted(): Promise<boolean>;
  onAccept(): Promise<void>;
};

export type RecorderState = {
  isOpen: boolean;
  name: string | null;
  type: NameTypes | null;
  pronunciation?: Pronunciation | undefined;
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
    pronunciation: undefined,
  }
) {
  const [recorderState, setRecorderState] = useState<RecorderState>(
    defaultState
  );

  const setRecorderOpen: (props: Omit<RecorderState, "isOpen">) => void = ({
    name,
    type,
    termsAndConditions,
    pronunciation,
  }) =>
    setRecorderState({
      name,
      type,
      isOpen: true,
      termsAndConditions,
      pronunciation,
    });

  const setRecorderClosed: () => void = () =>
    setRecorderState({
      name: null,
      type: null,
      isOpen: false,
      termsAndConditions: null,
      pronunciation: undefined,
    });

  return [recorderState, setRecorderClosed, setRecorderOpen] as const;
}

export default useRecorderState;
