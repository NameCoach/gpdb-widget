import React, {
  MouseEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";

export interface UIProps {
  hideLogo?: boolean;
}

export interface ElemStyleProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: object;
}

interface MainProperties {
  name: string;
  client: IFrontController;
  closable?: boolean;
  onClose?: MouseEventHandler;
  termsAndConditions?: TermsAndConditions;
}

type Props = MainProperties & ElemStyleProps & UIProps;

const cx = classNames.bind(styles);

const Widget = (props: Props) => {
  if (!props.name.trim()) throw new Error("Name shouldn't be blank");

  const controllerContextValue = useMemo(() => props.client, [props.client]);
  const [names, setNames] = useState<{ [t in NameTypes]: Name }>();
  const [loading, setLoading] = useState<boolean>(true);
  const styleContext = useContext(StyleContext);
  const t = useTranslator(props.client, styleContext);
  const customFeatures = useCustomFeatures(props.client, styleContext);

  const verifyNames = async () => {
    setLoading(true);
    setNames(await props.client.verifyNames(props.name));
    setLoading(false);
  };

  useEffect(() => {
    verifyNames();
  }, [props.name]);

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
            <Container
              names={names}
              verifyNames={verifyNames}
              hideLogo={props.hideLogo}
              termsAndConditions={props.termsAndConditions}
            />
          </ControllerContext.Provider>
        </StyleContext.Provider>
      )}
    </div>
  );
};

export default Widget;
