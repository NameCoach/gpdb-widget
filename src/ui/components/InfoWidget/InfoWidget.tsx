import React, { useState } from "react";
import { InfoDocumentElements } from "../../../types/info-document-elememts";
import Container from "./Container/Container";
import parse from "html-react-parser";

const InfoWidget = (props): JSX.Element => {
  const [errorEncounted, setErrorEncounted] = useState(false);
  const [onCloseWidget, setCloseWidget] = useState(false);

  const document = props.documentToRender;
  const elements = document?.elements;
  const closeAction = document?.closeAction;
  const styles = document?.generalStyles;

  const handleOnCloseWidget = async (): Promise<void> => {
    try {
      await props.callbackAction();

      setCloseWidget(true);
    } catch (e) {
      setErrorEncounted(true);
      console.log(e);
    }
  };

  const renderElement = (element: any): any => {
    if (element.type === InfoDocumentElements.RawHTML)
      return parse(element.data);

    if (element.type === InfoDocumentElements.HTML)
      return React.createElement(
        element.data.tag,
        element.data.props,
        element.data.children.map((e) => renderElement(e))
      );

    if (element.type === InfoDocumentElements.Collapsible)
      return <Container data={element.data} bodyAction={renderElement} />;
  };

  const renderCallback = (): JSX.Element => props.callbackComponent(props);

  const renderWidget = (): JSX.Element => (
    <div>
      {styles && <style>{styles}</style>}

      {errorEncounted && <div>Something went wrong</div>}

      {!errorEncounted && (
        <div className="document">
          {elements && (
            <>
              {elements.map((item, index) => (
                <React.Fragment key={index + item.type}>
                  {renderElement(item)}
                </React.Fragment>
              ))}
            </>
          )}

          {closeAction && (
            <div className="close-button">
              <button
                onClick={closeAction.callBackAction && handleOnCloseWidget}
              >
                {closeAction?.text ? closeAction.text : "Close"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return onCloseWidget ? renderCallback() : renderWidget();
};

export default InfoWidget;
