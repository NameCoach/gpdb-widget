import { useCallback } from "react";
import { getRecorderReducer } from "../recorderReducer";
import { RecorderReducer } from "../types";

interface useRecorderReducerArgs {
  onDelete, onRecord, onClose, onFail
}

export const useRecorderReducer = ({
  onDelete, onRecord, onClose, onFail
}: useRecorderReducerArgs):RecorderReducer => {
  const recorderReducer = useCallback(
    getRecorderReducer({ onDelete, onRecord, onClose, onFail}),
    [onDelete, onRecord, onClose, onFail]
  );
  
  return recorderReducer
};
