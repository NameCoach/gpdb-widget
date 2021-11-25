export interface UserPermissions {
  canUserResponse: Record<string, boolean>;
  canPronunciation: Record<string, boolean>;
  canRecordingRequest: Record<string, boolean>;
}
