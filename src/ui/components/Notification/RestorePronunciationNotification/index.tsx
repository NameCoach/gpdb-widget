import React, { useContext } from "react";
import ControllerContext from "../../../contexts/controller";
import StyleContext from "../../../contexts/style";
import loadT from "../../../hooks/LoadT";
import { useNotifications } from "../../../hooks/useNotification";
import styles from "./styles.module.css";

interface Props {
  id?: number;
  onClick: () => void;
}

const RestorePronunciationNotification = ({
  id,
  onClick,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);
  const styleContext = useContext(StyleContext);
  const t = styleContext.t || loadT(controller?.preferences?.translations);

  const { clearNotification } = useNotifications();

  const handleOnClick = (): void => {
    onClick();

    if (id) clearNotification(id);
  };

  return (
    <button className={styles.undo__button} onClick={handleOnClick}>
      {t(
        "restrore_pronunciation_button",
        "You have deleted your pronunciation.Undo"
      )}
    </button>
  );
};

export default RestorePronunciationNotification;
