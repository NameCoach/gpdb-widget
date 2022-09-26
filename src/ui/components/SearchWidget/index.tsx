import React, { useContext } from "react";
import IFrontController from "../../../types/front-controller";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import usePermissions from "../../hooks/usePermissions";
import { TermsAndConditions } from "../../hooks/useRecorderState";
import useTranslator from "../../hooks/useTranslator";
import NoPermissionsError from "../NoPermissionsError";
import SearchContainer from "./SearchContainer";

interface Props {
  client: IFrontController;
  termsAndConditions?: TermsAndConditions;
}

const SearchWidget = (props: Props): JSX.Element => {
  const client = props.client;

  const styleContext = useContext(StyleContext);

  const { t } = useTranslator(client, styleContext);

  const customFeatures = useCustomFeatures(client, styleContext);

  const { canPronunciation } = usePermissions(client.permissions);

  const canPerfromBasicSearch = canPronunciation("index");
  const canUseSearchWidget = canPronunciation("search-widget");

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
        {canUseSearchWidget && canPerfromBasicSearch && (
          <SearchContainer
            controller={client}
            termsAndConditions={props.termsAndConditions}
          />
        )}

        {canUseSearchWidget && !canPerfromBasicSearch && <NoPermissionsError />}

        {!canUseSearchWidget && <></>}
      </ControllerContext.Provider>
    </StyleContext.Provider>
  );
};

export default SearchWidget;
