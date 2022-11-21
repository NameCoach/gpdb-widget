export interface StateProps {
  handleOnRecorderClose: () => void;
  timer: number;
  onStop: () => Promise<void>;
}
