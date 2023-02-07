import React, { useMemo } from "react";
import {
  Speaker,
  SpeakerDisabled,
  SpeakerLibrary,
  SpeakerOwner,
  SpeakerPeer,
} from "../NewIcons";
import { IconButton } from "../Buttons/IconButton";


interface UnifiedSpeakerProps {
  type?: SpeakerTypes;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => any;
}

export enum SpeakerTypes {
  Peer = "peer",
  Owner = "owner",
  Library = "library",
  Default = "default",
  Disabled = "disabled",
}

const speakerComponents = {
  [SpeakerTypes.Peer]: SpeakerPeer,
  [SpeakerTypes.Owner]: SpeakerOwner,
  [SpeakerTypes.Library]: SpeakerLibrary,
  [SpeakerTypes.Default]: Speaker,
  [SpeakerTypes.Disabled]: SpeakerDisabled,
};

const _SpeakerButton = (
  { type, disabled = false, onClick, active = false }: UnifiedSpeakerProps,
  ref
): JSX.Element => {
  const Icon = useMemo(() => {
    return speakerComponents[type];
  }, [type]);

  return (
    <IconButton
      active={active || undefined}
      disabled={disabled}
      onClick={onClick}
      ref={ref}
    >
      <Icon/>
    </IconButton>
  );
};

export const SpeakerButton = React.forwardRef(_SpeakerButton);
