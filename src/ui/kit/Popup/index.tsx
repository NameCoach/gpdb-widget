import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import IconButtons from "../IconButtons";
import Surface from "./components/Surface";
import Arrow, { DEFAULT_ARROW } from "./components/Arrow";
import classNames from "classnames/bind";
import styles from "./styles.module.css";
import { PopupProps, Popup as PopupType, PopupRef } from "./types";
import { PopupContext } from "./contexts/popup_context";

const DefaultRect = typeof DOMRect === 'undefined' ? {left: 0, top: 0} as DOMRect : new DOMRect;

const cx = classNames.bind(styles);

const Popup = (props: PopupProps, ref: PopupRef): JSX.Element => {
  const { opener, closeable, closeOnOuterClick, children, id, disabled, show, fullWidth } = props;

  const [visible, setVisible] = useState<boolean>(show || false);
  const showPopup = !disabled && visible;
  const [openerPosition, setOpenerPosition] = useState<DOMRect>(DefaultRect);
  const _popupRef = useRef<HTMLDivElement>(null);
  const [placeholderStyles, setPlaceholderStyles] = useState<CSSProperties>({});
  const [surface, setSurface] = useState<HTMLDivElement>(null);
  const surfacePosition = surface?.getBoundingClientRect() || DefaultRect;
  const surfaceRef = useCallback((ref) => { setSurface(ref); }, []);
  const [placeholderPosition, setPlaceholderPosition] = useState<DOMRect>(DefaultRect);
  const [placeholder, setPlaceholder] = useState<HTMLDivElement>(null);
  const placeholderRef = useCallback((ref) => { setPlaceholder(ref) }, []);

  useImperativeHandle(
    ref,
    (): PopupType => ({
      isShown: visible,
      show: () => setVisible(true),
      isHidden: !visible,
      hide: () => setVisible(false),
      isDisabled: disabled,
    }),
    [visible, disabled]
  );

  const recalcOpenerPosition = (): void => {
    // recalculate position only of visible popups
    if (opener && visible) setOpenerPosition(opener.getBoundingClientRect());
  };

  const recalcPlaceholderPosition = (): void => {
    if (opener && visible && fullWidth && placeholder)
      setPlaceholderPosition(placeholder.getBoundingClientRect());
  }

  useLayoutEffect(() => {
    const recalcPosition = () => {
      recalcOpenerPosition();
      recalcPlaceholderPosition();
    };
    
    window.addEventListener("resize", recalcPosition);
    window.addEventListener("scroll", recalcPosition);
    recalcPosition();
    return () => {
      window.removeEventListener("resize", recalcPosition);
      window.removeEventListener("scroll", recalcPosition);
    };
  }, [opener, visible, placeholderStyles, placeholder]);

  const handleOuterClick = (e) => {
    const popup = _popupRef.current;
    if (!popup) return;
    if (!visible) return;

    const innerElements = Array.from(popup.getElementsByTagName("*"));
    const openerElements = Array.from(opener.getElementsByTagName("*"));
    const isOpenerClicked = openerElements.includes(e.target);
    const isInnerClicked = innerElements.includes(e.target);
    const isOuterClick = !(isInnerClicked || isOpenerClicked);

    if (visible && isOuterClick) setVisible(false);
  };

  useLayoutEffect(() => {
    if (closeOnOuterClick) {
      if (showPopup) window.addEventListener("click", handleOuterClick);
      else window.removeEventListener("click", handleOuterClick);
    }

    if (disabled && visible) setVisible(false);

    if (disabled || !visible) setOpenerPosition(DefaultRect);

    return () => window.removeEventListener("click", handleOuterClick);
  }, [visible, disabled]);

  useEffect(() => {
    setVisible(show);
  }, [show])

  useLayoutEffect(() => {
    if (!surface || !fullWidth) return;
    
    const surfaceRect = surfacePosition;
    const height = surfaceRect.height + DEFAULT_ARROW.height;

    if (placeholderStyles.height !== height)
      setPlaceholderStyles({...placeholderStyles, height});
  }, [surface, fullWidth, surfacePosition])

  const onCloseButtonClick = (): void => {
    setVisible(false);
  };

  const popupContext = {
    ...props,
    openerPosition,
    placeholderPosition
  };

  return (
    <>
      {openerPosition && (
        <PopupContext.Provider value={popupContext}>
          <div
            id={id}
            ref={_popupRef}
            className={cx(styles.container, { visible: showPopup, invisible: !showPopup })}
          >
            {fullWidth && (
              <div
                className={cx(styles.placeholder)}
                style={placeholderStyles}
                ref={placeholderRef}
              />
            )}
            <Surface ref={surfaceRef}>
              {closeable && (
                <IconButtons.CloseTooltip onClick={onCloseButtonClick} />
              )}
              {children}
            </Surface>
            <Arrow />
          </div>
        </PopupContext.Provider>
      )}
    </>
  );
};

export default React.forwardRef(Popup);
