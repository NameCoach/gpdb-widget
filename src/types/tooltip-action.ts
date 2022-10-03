export enum TooltipActionType {
  Button = "tooltip_button",
  Link = "tooltip_link",
}

type ITooltipAction = {
  actionType?: TooltipActionType;
  onClick?: (value?: any) => void;
};

export default ITooltipAction;
