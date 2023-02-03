export enum States {
  Initial = "Initial",
  Uploaded = "Uploaded",
  Failed = "Failed",
  RecorderFailed = "RecorderFailed",
}

export interface IUploaderContext {
  state: States,
  blob: Blob,
  audioUrl: string,
  fileName: string,
  fileError: string,
  upload: (e: Event) => void;
  close: () => void;
  setState: (state: States) => void;
}
