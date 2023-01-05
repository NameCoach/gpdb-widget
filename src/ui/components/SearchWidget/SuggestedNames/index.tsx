import classNames from "classnames/bind";
import React from "react";
import styles from "./styles.module.css";

const cx = classNames.bind(styles);

interface Props {
  names: string[];
  onClick: (value: string) => void;
}

const SuggestedNames = (
  { names, onClick }: Props,
  wrapperRef: React.MutableRefObject<HTMLDivElement>
): JSX.Element => {
  return (
    <div className={cx(styles.row, styles.suggestions_block)} ref={wrapperRef}>
      {names.map((name, key) => (
        <div
          tabIndex={key}
          className={styles.suggestion_line}
          key={key}
          onClick={(): void => onClick(name)}
        >
          <p className={styles.suggestion_name}>{name}</p>
        </div>
      ))}
    </div>
  );
};

export default React.forwardRef(SuggestedNames);
