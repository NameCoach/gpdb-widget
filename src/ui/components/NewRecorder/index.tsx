import React, { useContext } from "react";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useTranslator from "../../hooks/useTranslator";
import useTheme from "../../hooks/useTheme";
import { RecorderProvider } from "./hooks/useRecorder";
import { NameTypes } from "../../../types/resources/name";
import { NameOwner } from "gpdb-api-client";
import { RecorderCloseOptions } from "./types/handlers-types";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import Pronunciation from "../../../types/resources/pronunciation";
import { InboundRelativeSource } from "./types/inbound-relative-source";
import CurrentStep from "./Components/CurrentState";
import defaultStyles from "./styles/default/styles.module.css";
import outlookStyles from "./styles/outlook/styles.module.css";
import classNames from "classnames/bind";
import userAgentManager from "../../../core/userAgentManager";
import { Theme } from "../../../types/style-context";

const defaultCx = classNames.bind(defaultStyles);
const outlookCx = classNames.bind(outlookStyles);

interface Props {
  name: string;
  type: NameTypes;
  owner?: NameOwner;
  onRecorderClose: (option?: RecorderCloseOptions) => void;
  onSaved?: (blob?: Blob) => void;
  termsAndConditions?: TermsAndConditions;
  pronunciation?: Pronunciation;
  relativeSource?: InboundRelativeSource;
}

const NewRecorder = ({
  onRecorderClose,
  name,
  owner,
  type,
  termsAndConditions,
  onSaved,
  pronunciation,
  relativeSource,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);

  const { isDeprecated: isOld } = userAgentManager;

  const customFeatures = useCustomFeatures(controller, styleContext);
  const { t } = useTranslator(controller, styleContext);
  const { theme } = useTheme();

  const themeIsOutlook = theme === Theme.Outlook;
  const styles = themeIsOutlook ? outlookStyles : defaultStyles;
  const cx = themeIsOutlook ? outlookCx : defaultCx;

  return (
    <StyleContext.Provider
      value={{
        displayRecorderSavingMessage:
          styleContext?.displayRecorderSavingMessage,
        customFeatures,
        t,
        theme,
      }}
    >
      <RecorderProvider
        value={{
          onRecorderClose,
          name,
          owner,
          type,
          termsAndConditions,
          onSaved,
          pronunciation,
          relativeSource,
        }}
      >
        <div
          className={cx(styles.recorder, {
            old: isOld,
          })}
        >
          <CurrentStep />
        </div>
      </RecorderProvider>
    </StyleContext.Provider>
  );
};

export default NewRecorder;
