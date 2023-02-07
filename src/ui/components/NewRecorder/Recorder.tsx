import React, { useEffect, useReducer } from "react";
import Pronunciation from "../../../types/resources/pronunciation";
import {
  IRecorderContext,
  OnCloseCb,
  OnDeleteCb,
  OnFailCb,
  OnRecordCb,
  RecorderReducer,
  States,
} from "./types";
import {
  Countdown,
  Edit,
  Initial,
  Recorded,
  Recording,
  Settings,
} from "./states";
import { DEFAULT_SAMPLE_RATE } from "../Recorder/constants";
import { RecorderContext } from "./contexts";
import { useRecorderReducer } from "./hooks";

interface RecorderProps {
  pronunciation: Pronunciation;
  onDelete: OnDeleteCb;
  onRecord: OnRecordCb;
  onClose: OnCloseCb;
  onFail: OnFailCb
}

export const Recorder = ({
  pronunciation,
  onDelete,
  onRecord,
  onClose,
  onFail
}: RecorderProps) => {
  const recorderReducer = useRecorderReducer({onDelete, onRecord, onClose, onFail});
 
  const [recorderState, dispatch] = useReducer<RecorderReducer>(recorderReducer, {
    state: pronunciation ? States.Edit : States.Initial,
    sampleRate: DEFAULT_SAMPLE_RATE,
    defaultSampleRate: DEFAULT_SAMPLE_RATE,
    recorder: null,
    blob: null,
    audioUrl: null,
  });

  useEffect(() => {
    return () => {
      recorderState.recorder?.destroy();
    };
  }, []);

  const StateComponents = {
    [States.Initial]: Initial,
    [States.Edit]: Edit,
    [States.Countdown]: Countdown,
    [States.Recording]: Recording,
    [States.Recorded]: Recorded,
    [States.Settings]: Settings,
    [States.Closed]: React.Fragment,
  };

  const StateComponent = StateComponents[recorderState.state];

  const context: IRecorderContext = {
    recorderState,
    dispatch,
  };

  return (
    <RecorderContext.Provider value={context}>
      <StateComponent />
    </RecorderContext.Provider>
  );
};
