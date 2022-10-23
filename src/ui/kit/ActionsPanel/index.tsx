import React from "react";
import Children, { Child } from "../../../types/children-prop";
import Gap from "../Gap";
import styles from "./styles.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: Children;
}

const ActionsPanel = ({ children }: Props) => {
  const isArrayOfChild = Array.isArray(children);

  return (
    <div className={styles.flex_column_centered}>
      <div className={styles.flex_row}>
        {isArrayOfChild &&
          (children as Child[]).map((child, index, { length }) => {
            if (index === length - 1) return child;

            return (
              <>
                {child}
                <Gap box={10} />
              </>
            );
          })}

        {!isArrayOfChild && children}
      </div>
    </div>
  );
};

export default ActionsPanel;
