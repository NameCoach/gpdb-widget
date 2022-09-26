import React, { useEffect, useRef, useState } from "react";
import { PresentationMode as TooltipPresentation } from "../../../../../src/types/modal-tooltip";
import ModalTooltip from "../../ModalTooltip";
import classNames from "classnames";
import styles from "./styles.module.css";
import Close from "../../../../../src/ui/components/Close";

const cx = classNames.bind(styles);

const capitalizeString = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

interface ErrorsProps {
  id: string;
  messages: string[];
}

const tooltipStyle: React.CSSProperties = {
  position: "relative",
  inset: "auto auto 7px 5px",
  marginTop: "15px",
};

const Errors = ({ id, messages }: ErrorsProps) => {
  const [shown, setShown] = useState<boolean>(messages?.length > 0);

  useEffect(() => {
    setShown(messages?.length > 0);
  }, [messages]);

  return (
    <>
      {shown && (
        <div id={id} className={styles.container}>
          <div className={styles.messages}>
            {messages?.map((message, index) => (
              <p className={"something"} key={index}>
                {capitalizeString(message)}
              </p>
            ))}
          </div>
          <Close className="modal" onClick={() => setShown(false)} />
        </div>
      )}
    </>
  );
};

export default Errors;
