import { NameOwner } from "gpdb-api-client";
import Pronunciation from "../../../types/resources/pronunciation";
import * as Recorder from "../NewRecorder/types";
import * as LibRecs from "../LibraryRecordings/types";
import * as Avatar from "../AvatarEditor/types";

export enum Editors {
  Recorder = "Recorder",
  Uploader = "Uploader",
  Library = "Library",
}

export interface usePersonalArgs {
  name: string;
  owner: NameOwner;
}

export interface usePersonalReturn {
  showPersonalBlock: boolean;
  showAvatars: boolean;
  canAvatars: boolean;
  showLibraryRecordings: boolean;
  showRecorder: boolean;
  showUploader: boolean;
  showLibraryEditor: boolean;

  pronunciation: Pronunciation;
  libFNPronun: Pronunciation;
  libLNPronun: Pronunciation;
  tempFNPronun: Pronunciation;
  tempLNPronun: Pronunciation;

  loading: boolean;
  inEdit: boolean;

  firstName: string;
  lastName: string;

  touched: boolean;
  
  libDeleted: boolean;
  recFailed: boolean;
  showUnsavedTip: boolean;

  avatarUrl: string;
  tempAvatarUrl: string;
  tempAvatarFile: File;
  avatarError: string;

  openEdit: () => void;

  onEditClose: () => void;
  onEditSave: () => void;

  closeEditors: () => void;
  openRecorder: () => void;
  openUploader: () => void;
  openLibraryEditor: () => void;

  recOnDelete: Recorder.OnDeleteCb;
  recOnRecord: Recorder.OnRecordCb;
  recOnFail: Recorder.OnFailCb;

  libOnDelete: LibRecs.OnDeleteCb;
  libOnFNSelect: LibRecs.OnFNSelectCb;
  libOnLNSelect: LibRecs.OnLNSelectCb;

  avatarOnUpload: Avatar.OnUploadCb;
  avatarOnDelete: Avatar.OnDeleteCb;
  avatarOnFail: Avatar.OnFailCb;

  load: () => void;
}
