import React, { useContext } from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";
import useTranslator from "../../../../hooks/useTranslator";
import ControllerContext from "../../../../contexts/controller";

const cx = classNames.bind(styles);

type Errors = {
  fileSizeError?: boolean;
};

interface Props {
  onUploaderChange: (options: any) => void;
  isOld: boolean;
  errors?: Errors;
}

const FailedStateContainer = ({
  errors,
  onUploaderChange,
  isOld,
}: Props): JSX.Element => {
  const controller = useContext(ControllerContext);

  const { t } = useTranslator(controller);

  return (
    <>
      <span>{t("recorder_allow_microphone_and_try_again")}</span>
      <div className={cx(styles.uploader, { old: isOld })}>
        <div className={styles.uploader__message}>
          {t("recorder_uploader_message")}
        </div>
        <div className={styles.uploader__action}>
          <label
            htmlFor="pronunciation-upload"
            className={styles.upload__label}
          >
            {t("recorder_uploader_button")}
          </label>
          <input
            type="file"
            id="pronunciation-upload"
            name="recording"
            accept=".mp3"
            onChange={onUploaderChange}
          />
        </div>
      </div>
      {errors?.fileSizeError && (
        <div className={styles.error}>
          {t("recorder_uploader_file_max_size")}
        </div>
      )}
    </>
  );
};

export default FailedStateContainer;
