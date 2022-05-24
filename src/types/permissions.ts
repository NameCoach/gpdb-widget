export interface UserPermissions {
  canUserResponse: { [x: string]: boolean };
  canPronunciation: { [x: string]: boolean };
  canRecordingRequest: { [x: string]: boolean };
  canCustomAttributes: { [x: string]: boolean };
}
