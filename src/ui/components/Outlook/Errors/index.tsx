import React from "react";
import classNames from "classnames";
import styles from "./styles.module.css";
import capitalizeString from "../../../../core/utils/capitalize-string";

const cx = classNames.bind(styles);

interface ErrorsProps {
  id: string;
  messages: string[];
}

const Errors = ({ id, messages }: ErrorsProps) => {
  return (
    <div className={cx(styles.errors_block)}>
      {messages?.length > 0 && (
        <div id={id} className={styles.messages}>
          {messages?.map((message, index) => (
            <p key={index}>{capitalizeString(message)}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default Errors;
