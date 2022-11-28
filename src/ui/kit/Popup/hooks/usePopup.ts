import { useCallback, useState } from "react";
import { OpenerRef, Popup, PopupRef } from "../types";

export interface PopupHookReturn<OpenerType> {
  opener: OpenerType;
  popup: Popup;
  openerRef: OpenerRef<OpenerType>;
  popupRef: PopupRef;
  openerOnMouseClick: () => void;
}

const usePopup = <OpenerType = HTMLElement>(): PopupHookReturn<OpenerType> => {
  const [popup, setPopup] = useState<Popup>(null as Popup);
  const popupRef = useCallback<PopupRef>((ref) => {
    setPopup(ref);
  }, []);
  const [opener, setOpener] = useState<OpenerType>(null);
  const openerRef = useCallback<OpenerRef<OpenerType>>((el) => {
    setOpener(el);
  }, []);

  const openerOnMouseClick = () => {
    if (!popup) return;
    if (popup.isHidden) popup.show();
    if (popup.isShown) popup.hide();
  };

  return { 
    opener,
    popup,
    openerRef,
    popupRef,
    openerOnMouseClick
  }
};

export default usePopup;
