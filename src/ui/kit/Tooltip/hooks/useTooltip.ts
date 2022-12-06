import { useCallback, useLayoutEffect, useState } from "react";
import { TOOLTIP_HIDE_DELAY, TOOLTIP_SHOW_DELAY } from "../../../../constants";
import { OpenerRef, Popup, PopupRef } from "../../Popup/types";

export interface TooltipHookReturn<OpenerType> {
  opener: OpenerType;
  tooltip: Popup;
  openerRef: OpenerRef<OpenerType>;
  tooltipRef: PopupRef;
  openerOnMouseEnter: () => void;
  openerOnMouseLeave: () => void;
}

interface HookArgs {
  customHandlers?: boolean;
}

const useTooltip = <OpenerType = HTMLElement>({
  customHandlers = false,
}: HookArgs = {}): TooltipHookReturn<OpenerType> => {
  const [tooltip, setTooltip] = useState<Popup>(null as Popup);
  const tooltipRef = useCallback<PopupRef>((ref) => {
    setTooltip(ref);
  }, []);
  const [opener, setOpener] = useState<OpenerType>(null);
  const openerRef = useCallback<OpenerRef<OpenerType>>((el) => {
    setOpener(el);
  }, []);

  let openTimeout = null;
  let closeTimeout = null;

  const openerOnMouseEnter = () => {
    if (!tooltip) return;
    if (closeTimeout) clearTimeout(closeTimeout);
    if (tooltip.isHidden && !tooltip.isDisabled)
      openTimeout = setTimeout(tooltip.show, TOOLTIP_SHOW_DELAY);
  };

  const openerOnMouseLeave = () => {
    if (!tooltip) return;
    if (openTimeout) clearTimeout(openTimeout);
    if (tooltip.isShown && !tooltip.isDisabled)
      closeTimeout = setTimeout(tooltip.hide, TOOLTIP_HIDE_DELAY);
  };

  useLayoutEffect(() => {
    if (!customHandlers && opener) {
      const _opener = opener as unknown as HTMLElement;
      _opener.addEventListener("mouseenter", openerOnMouseEnter);
      _opener.addEventListener("mouseleave", openerOnMouseLeave);

      return () => {
        _opener.removeEventListener("mouseenter", openerOnMouseEnter);
        _opener.removeEventListener("mouseleave", openerOnMouseLeave);
      }
    }
  }, [opener, tooltip]);

  return {
    opener,
    tooltip,
    openerRef,
    tooltipRef,
    openerOnMouseEnter,
    openerOnMouseLeave,
  };
};

export default useTooltip;
