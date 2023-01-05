import React from "react";
import { Theme } from "../../../../types/style-context";
import useTheme from "../../../hooks/useTheme";
import { Props } from "./types";
import OutlookView from "./Outlook";

const views = {
  [Theme.Outlook]: (props): JSX.Element => <OutlookView {...props} />,
  [Theme.Default]: (props): JSX.Element => <OutlookView {...props} />,
};

const Actions = ({ ...props }: Props): JSX.Element => {
  const { theme } = useTheme();

  return <>{views[theme](props)}</>;
};

export default Actions;
