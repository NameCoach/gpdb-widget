import { useContext } from "react";
import { RecorderContext } from "../contexts";
import { ActionTypes, RecorderDispatch, RecorderState } from "../types";

interface useTransitionsReturn {
  ToClosed: () => void;
  ToCountdown: () => void;
  ToRecording: () => void;
  ToInitial: () => void;
  ToRecorded: () => void;
  ToSettings: () => void;
  ToDeleted: () => void;
  recorderState: RecorderState;
  dispatch: RecorderDispatch;
}

export const useTransitions = (): useTransitionsReturn => {
  const { recorderState, dispatch } = useContext(RecorderContext);

  const ToClosed = () => dispatch({ type: ActionTypes.ToClosed });
  const ToCountdown = () =>
    dispatch({ type: ActionTypes.ToCountdown, dispatch });
  const ToRecording = () => dispatch({ type: ActionTypes.ToRecording });
  const ToInitial = () => dispatch({ type: ActionTypes.ToInitial });
  const ToRecorded = () => dispatch({ type: ActionTypes.ToRecorded });
  const ToSettings = () => dispatch({ type: ActionTypes.ToSettings });
  const ToDeleted = () => dispatch({ type: ActionTypes.ToDeleted});

  return {
    ToClosed,
    ToCountdown,
    ToRecording,
    ToInitial,
    ToRecorded,
    ToSettings,
    ToDeleted,
    recorderState,
    dispatch,
  };
};
