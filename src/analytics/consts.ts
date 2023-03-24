export const AnalyticsEventTypes = {
  Common: {
    PlayPronunciation: "common_play_pronunciation",
    RequestPronunciation: "common_request_pronunciation",
    BookmarkPronunciation: "common_bookmark_pronunciation",
    RemoveBookmarkPronunciation: "common_remove_bookmark_pronunciation",
    SelectPronunciation: "common_select_pronunciation",
    EditPronunciation: "common_edit_pronunciation",
    RecordPronunciation: "common_record_pronunciation",
  },
  Recorder: {
    RecordingSaved: "recorder_recording_saved",
    StartButtonClick: "recorder_start_button_click",
    CancelButtonClick: "recorder_cancel_button_click",
    Recording: {
      Initialize: "recorder_recording_initialize",
      StopButtonClick: "recorder_recording_stop_button_click",
      CancelButtonClick: "recorder_recording_cancel_button_click",
    },
    Recorded: {
      PreviewButtonClick: "recorder_recorded_preview_button_click",
      CancelButtonClick: "recorder_recorded_cancel_button_click",
      RerecordButtonClick: "recorder_recorded_rerecord_button_click",
      SaveRecordingButtonClick: "recorder_recorded_save_recording_button_click",
    },
    Settings: {
      ButtonClick: "recorder_settings_button_click",
      PitchSliderClick: "recorder_settings_pitch_slider_click",
      CancelButtonClick: "recorder_settings_cancel_button_click",
      RerecordButtonClick: "recorder_settings_rerecord_button_click",
      DefaultButtonClick: "recorder_settings_default_button_click",
    },
    EditRecording: {
      CancelButtonClick: "recorder_edit_recording_cancel_button_click",
      DeleteButtonClick: "recorder_edit_recording_delete_button_click",
      RerecordButtonClick: "recorder_edit_recording_rerecord_button_click",
      DeleteUndoButtonClick: "recorder_edit_recording_delete_undo_button_click",
    },
    MicrophoneUnavailable: {
      Initialize: "recorder_microphone_unavailable",
      UploadButtonClick: "recorder_microphone_unavailable_upload_button_click",
      RecordButtonClick: "recorder_microphone_unavailable_record_button_click",
      CancelButtonClick: "recorder_microphone_unavailable_cancel_button_click",
    },
    Uploading: {
      PreviewButtonClick: "recorder_uploading_preview_button_click",
      CancelButtonClick: "recorder_uploading_cancel_button_click",
      ReuploadButtonClick: "recorder_reupload_button_click",
      SaveButtonClick: "recorder_uploading_save_button_click",
    },
  },
  Help: {
    ButtonClick: "help_button_click",
    CopeLogsButtonClick: "help_copy_logs_button_click",
    ContactSupportButtonClick: "help_contact_support_button_click",
  },
};
