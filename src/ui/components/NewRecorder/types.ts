import { Dispatch } from "react";
import RecordRTC from "../../../recordrtc-fork/RecordRTC.js";

export enum States {
  Initial = "Initial",
  Edit = "Edit",
  Countdown = "Countdown",
  Recording = "Recording",
  Recorded = "Recorded",
  Failed = "Failed",
  Settings = "Settings",
  Closed = "Closed",
}

export interface RecorderState {
  state: States;
  sampleRate: number;
  defaultSampleRate: number;
  recorder: RecordRTC;
  audioUrl: string;
  blob: Blob;
}

export enum ActionTypes {
  // utility
  SetState = "SetState",
  SetSampleRate = "SetSampleRate",
  SetDefaultSampleRate = "SetDefaultSampleRate",
  SetRecorder = "SetRecorder",
  
  // state transitions
  ToCountdown = "ToCountdown",
  ToRecording = "ToRecording",
  ToRecorded = "ToRecorded",
  ToSettings = "ToSettings",
  ToFailed = "ToFailed",
  ToClosed = "ToClosed",
  ToDeleted = "ToDeleted",
  ToInitial = "ToInitial",
}

// utility
export type SetState = { type: ActionTypes.SetState; state: States };
export type SetSampleRate = {
  type: ActionTypes.SetSampleRate;
  sampleRate: number;
};
export type SetDefaultSampleRate = {
  type: ActionTypes.SetDefaultSampleRate;
  defaultSampleRate: number;
};
export type SetRecorder = {
  type: ActionTypes.SetRecorder;
  recorder: RecordRTC;
};

// state transitions
export type ToCountdown = { type: ActionTypes.ToCountdown, dispatch: RecorderDispatch };
export type ToRecording = { type: ActionTypes.ToRecording };
export type ToRecorded = { type: ActionTypes.ToRecorded };
export type ToSettings = { type: ActionTypes.ToSettings };
export type ToFailed = { type: ActionTypes.ToFailed };
export type ToClosed = { type: ActionTypes.ToClosed };
export type ToDeleted = { type: ActionTypes.ToDeleted };
export type ToInitial = { type: ActionTypes.ToInitial };

export type Action =
  | SetState
  | SetSampleRate
  | SetDefaultSampleRate
  | SetRecorder
  | ToDeleted
  | ToCountdown
  | ToRecording
  | ToRecorded
  | ToSettings
  | ToFailed
  | ToClosed
  | ToInitial;

export type RecorderReducer = (
  recorderState: RecorderState,
  action: Action
) => RecorderState;

export type RecorderDispatch = Dispatch<Action>;

export interface IRecorderContext {
  recorderState: RecorderState;
  dispatch: RecorderDispatch;
}

export type OnDeleteCb = () => void;
export type OnRecordCb = (args?: { blob?: Blob; audioUrl?: string }) => void;
export type OnFailCb = () => void;
export type OnCloseCb = () => void;

interface RecorderReducerFactoryArgs {
  onDelete: OnDeleteCb;
  onRecord: OnRecordCb;
  onFail: OnFailCb;
  onClose: OnCloseCb;
}
export type RecorderReducerFactory = (
  args?: RecorderReducerFactoryArgs
) => RecorderReducer;
