import React, { useContext, useMemo } from "react";
import IFrontController from "../../../types/front-controller";
import { NameOption } from "../FullNamesList";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import PronunciationsBlock from "../PronunciationsBlock";
import NoPermissionsError from "../NoPermissionsError";
import { HtmlComponents } from "../../customFeaturesManager";
import useTranslator from "../../hooks/useTranslator";
import usePermissions from "../../hooks/usePermissions";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import { PersonalSection } from "../PersonalSection";

interface Props {
  client: IFrontController;
  name: Omit<NameOption, "key">;
  names: NameOption[];
  termsAndConditions?: TermsAndConditions;
}

enum Blocks {
  Pronunciations = "pronunciations",
  MyInfo = "myInfo",
  Invalid = "invalid",
}

const cx = classNames.bind(styles);

const PronunciationMyInfoWidget = ({
  client,
  name,
  names,
  termsAndConditions,
}: Props): JSX.Element => {
  if (!name.value.trim()) throw new Error("Name shouldn't be blank");

  const styleContext = useContext(StyleContext);
  const { t } = useTranslator(client, styleContext);
  const customFeatures = useCustomFeatures(client, styleContext);

  const { canPronunciation } = usePermissions(client.permissions);

  const blockPermissions = useMemo(
    () => ({
      [Blocks.Pronunciations]: canPronunciation("index"),
      [Blocks.MyInfo]: canPronunciation("index") && canPronunciation("create"),
      [Blocks.Invalid]: !canPronunciation("index"),
    }),
    [canPronunciation]
  );

  const Container = (
    <div className={cx(styles.container)}>
      {names.length !== 0 && blockPermissions[Blocks.Pronunciations] && (
        <PronunciationsBlock
          names={names}
          controller={client}
        />
      )}

      {blockPermissions[Blocks.MyInfo] && (
        <>
          <PersonalSection
            name={name.value}
            owner={name.owner}
            termsAndConditions={termsAndConditions}
          />
          {customFeatures.renderCustomComponent(HtmlComponents.UnderMyInfo)}
        </>
      )}
    </div>
  );

  return (
    <StyleContext.Provider
      value={{
        ...styleContext,
        displayRecorderSavingMessage:
          styleContext?.displayRecorderSavingMessage,
        customFeatures,
        t,
      }}
    >
      <ControllerContext.Provider value={client}>
        {blockPermissions[Blocks.Invalid] ? <NoPermissionsError /> : Container}
      </ControllerContext.Provider>
    </StyleContext.Provider>
  );
};

export default PronunciationMyInfoWidget;
