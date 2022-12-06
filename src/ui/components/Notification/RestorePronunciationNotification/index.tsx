import React, { useContext } from "react";
import { Theme } from "../../../../types/style-context";
import ControllerContext from "../../../contexts/controller";
import { useNotifications } from "../../../hooks/useNotification";
import useTheme from "../../../hooks/useTheme";
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
  const { theme } = useTheme();

  const { clearNotification } = useNotifications();

  const handleOnClick = (): void => {
    onClick();

    if (id) clearNotification(id);
  };

  const message = t(
    "outlook_restrore_pronunciation_message",
    "You have deleted your recording"
  );

  const btnMessage = t("outlook_restrore_pronunciation_button", "Undo");

  const themeIsOutlook = theme === Theme.Outlook;
  const themeIsDefault = !theme || theme === Theme.Default;

  return (
    <>
      {themeIsOutlook && (
        <div className={styles.flex_column}>
          <div className={styles.text_container}>{message}</div>
          <div className={styles.btn__link} onClick={handleOnClick}>
            {btnMessage}
          </div>
        </div>
      )}

      {themeIsDefault && (
        <button className={styles.undo__button} onClick={handleOnClick}>
          {t(
            "restrore_pronunciation_button",
            "You have deleted your pronunciation. Undo"
          )}
        </button>
      )}
    </>
  );
};

export default RestorePronunciationNotification;
