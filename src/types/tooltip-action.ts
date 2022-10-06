export enum TooltipActionType {
  InlineButton = "inline_button",
  Button = "tooltip_button",
  Link = "tooltip_link",
}

type ITooltipAction = {
  actionType?: TooltipActionType;
  onClick?: (value?: any) => void;
};

export default ITooltipAction;
