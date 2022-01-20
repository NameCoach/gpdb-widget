import React, { CSSProperties, useEffect, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";

const cx = classNames.bind(styles);

const modalMargin = { top: 15, left: 100 };

export interface CopyButton {
  url: string;
  text: string;
}

interface Props {
  buttons: CopyButton[];
}

const ShareAudioUrlAction = (props: Props): JSX.Element => {
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const buttonsRefs = useRef([]);
  const shareButton = useRef(null as HTMLImageElement);

  const getButtons = (): CopyButton[] => {
    return props.buttons.map(
      ({ url, text }): CopyButton => ({
        url: url.split("?")[0],
        text,
      })
    );
  };
  const buttons = getButtons();

  const onShareClick = (): void => {
    if (showModal) return;

    setShowSuccess(false);
    setShowModal(true);
  };

  const closeModal = (): void => {
    if (!showModal) return;

    setShowModal(false);
  };

  const handleOutsideClick = (e): void => {
    if (
      buttonsRefs.current.includes(e.target) ||
      shareButton.current === e.target
    )
      return;

    closeModal();
  };

  useEffect(() => {
    if (showModal)
      document.addEventListener("click", handleOutsideClick, { once: true });

    return (): void =>
      document.removeEventListener("click", handleOutsideClick);
  }, [showModal]);

  const showCopySuccess = (text) => (): void => {
    setSuccessMessage(text);
    setShowSuccess(true);
    setTimeout(() => setShowModal(false), 1000);
  };

  const getModalStyles = (): CSSProperties => {
    const styles = {
      opacity: 0,
      visibility: "hidden",
    } as CSSProperties;

    if (showModal) {
      styles.opacity = 1;
      styles.visibility = "visible";
    }

    if (shareButton.current) {
      const position = shareButton.current.getBoundingClientRect();
      styles.top =
        position.top <= 0 ? position.top : position.top - modalMargin.top;
      styles.left =
        position.left <= 0 ? position.left : position.left - modalMargin.left;
    }

    return styles;
  };

  return (
    <>
      <div aria-label="Share pronunciation" className={cx(styles.icon_button)}>
        <a onClick={onShareClick}>
          <i className={cx("share-audio-url")} ref={shareButton} />
        </a>
      </div>
      <div className={cx(styles.copy_modal)} style={getModalStyles()}>
        <div className={cx(styles.success_message)} hidden={!showSuccess}>
          {successMessage}
        </div>
        {buttons.map((b, index) => {
          return (
            <CopyToClipboard
              text={b.url}
              key={index}
              onCopy={showCopySuccess(`${b.text} copied`)}
              hidden={showSuccess}
            >
              <button
                className="copy-modal-button"
                disabled={!showModal}
                ref={(el): void => {
                  buttonsRefs.current[index] = el;
                }}
              >
                {b.text}
              </button>
            </CopyToClipboard>
          );
        })}
      </div>
    </>
  );
};

export default ShareAudioUrlAction;
