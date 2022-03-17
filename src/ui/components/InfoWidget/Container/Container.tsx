import React, { useState } from "react";
import Collapsible from "react-collapsible";
import CollapsableAction from "../../Actions/Collapsable";

const Container = (props): JSX.Element => {
  const header = props.data?.header;
  const body = props.data?.body;
  const bodyStyles = body?.css;
  const bodyChildren = body?.children;
  const collapsed = props.data?.collapsed;
  const generalStyle = props.data?.css;
  const renderElement = (elem) => props.bodyAction(elem);

  const [active, setActive] = useState(collapsed);

  const headerElement = (
    <div className="collapsible_header-row">
      <div className={header?.name}>{header.text}</div>

      <CollapsableAction active={active} effectsOff />
    </div>
  );

  const renderCollapsible = (): JSX.Element => (
    <Collapsible
      trigger={headerElement}
      open={collapsed}
      triggerClassName="collapsible-header"
      triggerOpenedClassName="collapsible-header"
      onOpen={(): void => setActive(true)}
      onClose={(): void => setActive(false)}
    >
      <div className={body?.name}>
        {bodyStyles && <style>{bodyStyles}</style>}

        {bodyChildren && (
          <>
            {bodyChildren.map((item, index) => (
              <React.Fragment key={index + item.type}>
                {renderElement(item)}
              </React.Fragment>
            ))}
          </>
        )}
      </div>
    </Collapsible>
  );

  return (
    <div className="collapsible-container">
      {generalStyle && <style>{generalStyle}</style>}

      {renderCollapsible()}
    </div>
  );
};

export default Container;
