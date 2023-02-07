import { NameOwner } from "gpdb-api-client";
import Pronunciation from "../../../types/resources/pronunciation";

export interface LibraryRecordingsProps {
  owner: NameOwner;
  firstName?: string;
  lastName?: string;
  firstNamePronun?: Pronunciation;
  lastNamePronun?: Pronunciation;
  deleted: boolean;
  onClose: OnCloseCb;
  onDelete: OnDeleteCb;
  onFirstNameSelect: OnFNSelectCb;
  onLastNameSelect: OnLNSelectCb
}

export type OnFNSelectCb = (pronun: Pronunciation) => void;
export type OnLNSelectCb = (pronun: Pronunciation) => void;;
export type OnCloseCb = () => void;
export type OnDeleteCb = () => void;
