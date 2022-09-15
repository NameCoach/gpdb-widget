import React from "react";
import styles from "./styles.module.css";
import classNames from "classnames/bind";

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
  return (
    <>
      <span>Allow microphone and try again, please.</span>
      <div className={cx(styles.uploader, { old: isOld })}>
        <div className={styles.uploader__message}>
          If you are having trouble with your microphone, please upload an mp3
          file.
        </div>
        <div className={styles.uploader__action}>
          <label
            htmlFor="pronunciation-upload"
            className={styles.upload__label}
          >
            Upload
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
        <div className={styles.error}>File max size is 5 MB</div>
      )}
    </>
  );
};

export default FailedStateContainer;
