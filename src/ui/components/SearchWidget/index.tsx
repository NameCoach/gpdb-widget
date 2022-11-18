import React, { useContext } from "react";
import IFrontController from "../../../types/front-controller";
import ControllerContext from "../../contexts/controller";
import StyleContext from "../../contexts/style";
import useCustomFeatures from "../../hooks/useCustomFeatures";
import useFeaturesManager, { ShowComponents } from "../../hooks/useFeaturesManager";
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

  const { show } = useFeaturesManager(
    client.permissions,
    customFeatures
  );

  return (
    <>
      {show(ShowComponents.SearchWidget) && (
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
            <>
              {canPerfromBasicSearch ? (
                <SearchContainer
                  controller={client}
                  termsAndConditions={props.termsAndConditions}
                />
              ) : (
                <NoPermissionsError />
              )}
            </>
          </ControllerContext.Provider>
        </StyleContext.Provider>
      )}
    </>
  );
};

export default SearchWidget;
