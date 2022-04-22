import React, { MouseEventHandler, useContext, useMemo, useState } from "react";
import IFrontController from "../../../types/front-controller";
import ControllerContext from "../../contexts/controller";
import Container from "../Container";
import Name, { NameTypes } from "../../../types/resources/name";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import Close from "../Close";
import Loader from "../Loader";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import StyleContext from "../../contexts/style";
import loadCustomFeatures from "../../hooks/loadCustomFatures";
import loadT from "../../hooks/LoadT";

export interface ElemStyleProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: object;
}

interface MainProperties {
  names: { [t in NameTypes]: Name };
  client: IFrontController;
  closable?: boolean;
  onClose?: MouseEventHandler;
  termsAndConditions?: TermsAndConditions;
}

type Props = MainProperties & ElemStyleProps;

const cx = classNames.bind(styles);

const ExtensionWidget = (props: Props): JSX.Element => {
  const controllerContextValue = useMemo(() => props.client, [props.client]);
  const [names, setNames] = useState<{ [t in NameTypes]: Name }>(props.names);
  const [loading, setLoading] = useState<boolean>(false);
  const styleContext = useContext(StyleContext);
  const t = loadT(props.client?.preferences?.translations);
  const customFeatures = loadCustomFeatures(
    props.client?.preferences?.custom_features
  );

  const verifyNames = async (): Promise<void> => {
    setLoading(true);
    setNames(await props.client.verifyNames(props.names.fullName.key));
    setLoading(false);
  };

  return (
    <div
      className={cx(styles.widget, props.className)}
      style={{ ...props.style, maxWidth: props.width, height: props.height }}
    >
      {props.closable && <Close onClick={props.onClose} />}
      {loading ? (
        <Loader inline />
      ) : (
        <StyleContext.Provider
          value={{
            displayRecorderSavingMessage:
              styleContext?.displayRecorderSavingMessage,
            customFeatures,
            t,
          }}
        >
          <ControllerContext.Provider value={controllerContextValue}>
            <Container names={names} verifyNames={verifyNames} />
          </ControllerContext.Provider>
        </StyleContext.Provider>
      )}
    </div>
  );
};

export default ExtensionWidget;
