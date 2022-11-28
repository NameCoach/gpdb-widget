export interface PopupProps {
  opener: any;
  closeable?: boolean;
  closeOnOuterClick?: boolean;
  fullWidth?: boolean;
  leftArrow?: boolean;
  rightArrow?: boolean;
  children?: React.ReactNode;
  id?: string;
  disabled?: boolean;
  show?: boolean;
  arrowSideOffset?: number;
};

export type OpenerRef<OpenerType> = (el: OpenerType) => void;

export interface Popup {
  isShown: boolean;
  show: () => void;
  isHidden: boolean;
  hide: () => void;
  isDisabled: boolean;
};

export type PopupRef = (el: Popup) => void;

interface OpenerPosition {
  openerPosition: DOMRect;
};

interface PlaceholderPosition {
  placeholderPosition: DOMRect;
}

export type IPopupContext = PopupProps & OpenerPosition & PlaceholderPosition;

export interface Offset {
  top: number;
  left: number;
}
