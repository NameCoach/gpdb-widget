import React, { useEffect, useRef, useState } from "react";

interface Props {
  initialText: string;
  newText: string;
  revertAfterChange?: boolean;
  revertDelay?: number;
  onClick?: () => void;
  className?: string;
}

const DEFAULT_REVERT_DELAY = 1000;

const ChangeableText = ({
  initialText,
  newText,
  revertAfterChange,
  revertDelay = DEFAULT_REVERT_DELAY,
  ...rootDOMAttributes
}: Props): JSX.Element => {
  const [changed, setChanged] = useState(false);
  const mountedRef = useRef(true);

  const onClick = (): void => {
    rootDOMAttributes.onClick && rootDOMAttributes.onClick();

    setChanged(true);

    if (revertAfterChange === true) {
      setTimeout(() => {
        if (mountedRef.current === true) setChanged(false);
      }, revertDelay);
    }
  };

  useEffect(() => {
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <div {...rootDOMAttributes} onClick={onClick}>
      {changed ? newText : initialText}
    </div>
  );
};

export default ChangeableText;
