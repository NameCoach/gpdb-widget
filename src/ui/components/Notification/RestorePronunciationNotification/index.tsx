import React, { useContext } from "react";
import ControllerContext from "../../../contexts/controller";
import { useNotifications } from "../../../hooks/useNotification";
import useTranslator from "../../../hooks/useTranslator";
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
  const { t } = useTranslator(controller);

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
