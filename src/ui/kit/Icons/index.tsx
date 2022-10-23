import React from "react";
import BookmarkIcon from "./Bookmark";
import CloseIcon from "./Close";
import EditIcon from "./Edit";
import HelpIcon from "./Help";
import MicrophoneIcon from "./Microphone";
import RequestIcon from "./Request";
import SaveIcon from "./Save";
import SearchIcon from "./Search";
import SettingsIcon from "./Settings";
import ShareIcon from "./Share";
import SpeakerIcon from "./Speaker";
import SpeakerLibraryIcon from "./SpeakerLibrary";
import SpeakerNoRecordingIcon from "./SpeakerNoRecording";
import SpeakerOwnerIcon from "./SpeakerOwner";
import SpeakerPeerIcon from "./SpeakerPeer";
import CloseTooltipIcon from "./CloseTooltip";
import {
  CheckBoxIconProps,
  IconProps,
  PlayableIconProps,
  SavedIconProps,
} from "./types";
import CheckBoxIcon from "./CheckBox";

const Icons = {
  Bookmark: (props: SavedIconProps): React.ReactElement<SavedIconProps> => (
    <BookmarkIcon {...props} />
  ),
  Checkbox: (props: CheckBoxIconProps): React.ReactElement<SavedIconProps> => (
    <CheckBoxIcon {...props} />
  ),
  Close: (props: IconProps): React.ReactElement<IconProps> => (
    <CloseIcon {...props} />
  ),
  CloseTooltip: (props: IconProps): React.ReactElement<IconProps> => (
    <CloseTooltipIcon {...props} />
  ),
  Edit: (props: IconProps): React.ReactElement<IconProps> => (
    <EditIcon {...props} />
  ),
  Help: (props: IconProps): React.ReactElement<IconProps> => (
    <HelpIcon {...props} />
  ),
  Microphone: (props: IconProps): React.ReactElement<IconProps> => (
    <MicrophoneIcon {...props} />
  ),
  Request: (props: IconProps): React.ReactElement<IconProps> => (
    <RequestIcon {...props} />
  ),
  Save: (props: IconProps): React.ReactElement<IconProps> => (
    <SaveIcon {...props} />
  ),
  Search: (props: IconProps): React.ReactElement<IconProps> => (
    <SearchIcon {...props} />
  ),
  Settings: (props: IconProps): React.ReactElement<IconProps> => (
    <SettingsIcon {...props} />
  ),
  Share: (props: IconProps): React.ReactElement<IconProps> => (
    <ShareIcon {...props} />
  ),
  Speaker: (
    props: PlayableIconProps
  ): React.ReactElement<PlayableIconProps> => <SpeakerIcon {...props} />,
  SpeakerLibrary: (
    props: PlayableIconProps
  ): React.ReactElement<PlayableIconProps> => <SpeakerLibraryIcon {...props} />,
  SpeakerNoRecording: (
    props: PlayableIconProps
  ): React.ReactElement<PlayableIconProps> => (
    <SpeakerNoRecordingIcon {...props} />
  ),
  SpeakerOwner: (
    props: PlayableIconProps
  ): React.ReactElement<PlayableIconProps> => <SpeakerOwnerIcon {...props} />,
  SpeakerPeer: (
    props: PlayableIconProps
  ): React.ReactElement<PlayableIconProps> => <SpeakerPeerIcon {...props} />,
};

export default Icons;
