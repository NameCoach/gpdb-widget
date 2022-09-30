import React, { useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import Close from "../../../../../src/ui/components/Close";
import capitalizeString from "../../../../core/utils/capitalize-string";

const cx = classNames.bind(styles);

interface ErrorsProps {
  id: string;
  messages: string[];
}

const Errors = ({ id, messages }: ErrorsProps) => {
  const [shown, setShown] = useState<boolean>(messages?.length > 0);

  useEffect(() => {
    setShown(messages?.length > 0);
  }, [messages]);

  return (
    <div className={cx(styles.row)}>
      {shown && (
        <div id={id} className={styles.container}>
          <div className={styles.messages}>
            {messages?.map((message, index) => (
              <p key={index}>
                {capitalizeString(message)}
              </p>
            ))}
          </div>
          <Close className="modal" onClick={() => setShown(false)} />
        </div>
      )}
    </div>
  );
};

export default Errors;
