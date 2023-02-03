export interface AvatarEditorProps {
  name?: string;
  src?: string;
  tempFileName?: string;
  tempError?: string;
  onDelete: OnDeleteCb;
  onUpload: OnUploadCb;
  onFail?: OnFailCb;
}

export type OnDeleteCb = () => void;
export type OnUploadCb = ({file, url}: { file: File, url: string}) => void;
export type OnFailCb = (error: string) => void;
