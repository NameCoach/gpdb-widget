import useRecordRTC from "../Recorder/hooks/useRecordRTC";
import {
  Action,
  ActionTypes,
  RecorderDispatch,
  RecorderReducerFactory,
  RecorderState,
  RecorderReducer,
  States,
} from "./types";

export const getRecorderReducer: RecorderReducerFactory = ({
  onDelete,
  onRecord,
  onClose,
  onFail,
}): RecorderReducer => (
  recorderState: RecorderState,
  action: Action
): RecorderState => {
  console.log("Recorder reducer recived action.", action);

  const reduceDeleted = (recorderState: RecorderState): RecorderState => {
    if (onDelete) setTimeout(() => onDelete(), 0);

    return { ...recorderState, state: States.Initial };
  };

  const reduceRecorded = (recorderState: RecorderState): RecorderState => {
    const { recorder } = recorderState;
    const newRecState = { ...recorderState };

    if (recorder) {
      const blob = recorder.getBlob();
      const audioUrl = recorder.toURL();
      const internalRecorder = recorder.getInternalRecorder() as any;
      console.log(`Recorder Sample Rate: ${internalRecorder.sampleRate}`);

      recorder.destroy();

      newRecState.recorder = null;
      newRecState.blob = blob;
      newRecState.audioUrl = audioUrl;

      if (onRecord) setTimeout(() => onRecord({ blob, audioUrl }), 0);
    }

    newRecState.state = States.Recorded;

    return newRecState;
  };

  const reduceCountdown = (
    recorderState: RecorderState,
    dispatch: RecorderDispatch
  ) => {
    useRecordRTC({
      log: console.log,
      desiredSampleRate: recorderState.sampleRate,
      defaultSampleRate: recorderState.defaultSampleRate,
      setDesiredSampleRate: (sampleRate) =>
        dispatch({ type: ActionTypes.SetSampleRate, sampleRate }),
      setDefaultSampleRate: (defaultSampleRate) =>
        dispatch({
          type: ActionTypes.SetDefaultSampleRate,
          defaultSampleRate,
        }),
    })()
      .then((recorder) => dispatch({ type: ActionTypes.SetRecorder, recorder }))
      .catch((e) => {
        console.log(e);
        if (onFail) setTimeout(() => onFail(), 0);
      });

    return { ...recorderState, state: States.Countdown };
  };

  const reduceClosed = (recorderState: RecorderState) => {
    const { recorder } = recorderState;

    recorder?.destroy();

    if (onClose) setTimeout(() => onClose(), 0);

    return {
      ...recorderState,
      state: States.Closed,
      recorder: null,
      blob: null,
      audioUrl: null,
    };
  };

  switch (action.type) {
    // utilits
    case ActionTypes.SetState:
      return { ...recorderState, state: action.state };
    case ActionTypes.SetSampleRate:
      return { ...recorderState, sampleRate: action.sampleRate };
    case ActionTypes.SetDefaultSampleRate:
      return { ...recorderState, defaultSampleRate: action.defaultSampleRate };
    case ActionTypes.SetRecorder:
      return { ...recorderState, recorder: action.recorder };

    // transitions
    case ActionTypes.ToCountdown:
      return reduceCountdown(recorderState, action.dispatch);
    case ActionTypes.ToRecording:
      return { ...recorderState, state: States.Recording };
    case ActionTypes.ToRecorded:
      return reduceRecorded(recorderState);
    case ActionTypes.ToSettings:
      return { ...recorderState, state: States.Settings };
    case ActionTypes.ToDeleted:
      return reduceDeleted(recorderState);
    case ActionTypes.ToClosed:
      return reduceClosed(recorderState);
    case ActionTypes.ToInitial:
      return { ...recorderState, state: States.Initial };
    default:
      throw new Error("Unkown action");
  }
};
