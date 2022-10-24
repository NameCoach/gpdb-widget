import React from "react";
import { Theme } from "../../../../types/style-context";
import useTheme from "../../../hooks/useTheme";
import DefaultView from "./Default";
import OutlookView from "./Outlook";
import { Props } from "./types";

const views = {
  [Theme.Outlook]: (props): JSX.Element => <OutlookView {...props} />,
  [Theme.Default]: (props): JSX.Element => <DefaultView {...props} />,
};

const Actions = ({ ...props }: Props): JSX.Element => {
  console.warn("saved", props.saved);
  const { theme } = useTheme();

  return <>{views[theme](props)}</>;
};

export default Actions;
