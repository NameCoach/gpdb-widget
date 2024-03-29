import React from "react";
import useTheme from "../../../../hooks/useTheme";
import OutlookView from "./Views/Outlook";
import { SettingsProps } from "./types";
import { Theme } from "../../../../../types/style-context";

const views = {
  [Theme.Outlook]: (props): JSX.Element => <OutlookView {...props} />,
  [Theme.Default]: (props): JSX.Element => <OutlookView {...props} />,
};

const Settings = ({ ...props }: SettingsProps): JSX.Element => {
  const { theme } = useTheme();

  return <>{views[theme](props)}</>;
};

export default Settings;
