import React from "react";
import { Theme } from "../../../../types/style-context";
import useTheme from "../../../hooks/useTheme";
import { DefaultViewProps, OutlookViewProps } from "../types/views";
import DefaultView from "./Default";
import OutlookView from "./Outlook";

const views = {
  [Theme.Outlook]: (props): JSX.Element => <OutlookView {...props} />,
  [Theme.Default]: (props): JSX.Element => <DefaultView {...props} />,
};

type ViewProps = DefaultViewProps | OutlookViewProps;

const View = ({ ...props }: ViewProps): JSX.Element => {
  const { theme } = useTheme();

  return <>{views[theme](props)}</>;
};

export default View;
