import React, { ReactElement, useMemo } from "react";
import Children, { Child } from "../../../types/children-prop";
import Gap from "../Gap";
import styles from "./styles.module.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: Children;
}

const ActionsPanel = (props: Props) => {
  const { childrenAreArray, children } = useMemo(() => {
    const fragment = props.children as ReactElement;
    const childrenAreFragment = fragment.type === React.Fragment;

    let children = childrenAreFragment
      ? fragment.props.children
      : props.children;

    const childrenTypeIsArray = Array.isArray(children);

    const childrenAreArray = childrenTypeIsArray
      ? children.filter((e) => e).length > 1
      : false;

    if (childrenAreArray) children = children.filter((child) => child);

    return { childrenAreArray, children };
  }, [props.children]);

  return (
    <div className={styles.flex_column_centered}>
      <div className={styles.flex_row}>
        {childrenAreArray &&
          (children as Child[]).map((child, index, { length }) => {
            if (index === length - 1) return child;

            return (
              <React.Fragment key={index}>
                {child}
                <Gap box={10} />
              </React.Fragment>
            );
          })}

        {!childrenAreArray && children}
      </div>
    </div>
  );
};

export default ActionsPanel;
