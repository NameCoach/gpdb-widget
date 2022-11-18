export interface Props {
  onRecordClick: () => void;
  showRecordAction: boolean;
  disableRequestAction: boolean;
  onRequest: () => Promise<void>;
  showRequestAction: boolean;
}
