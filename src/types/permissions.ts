export interface UserPermissions {
  canUserResponse: { [x: string]: boolean };
  canPronunciation: { [x: string]: any };
  canRecordingRequest: { [x: string]: boolean };
  canCustomAttributes: { [x: string]: boolean };
}
