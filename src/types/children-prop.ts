import { ReactElement } from "react";
import ITooltipAction from "./tooltip-action";

export type Child = ReactElement<ITooltipAction> | null;

type Children = Child[] | null;

export default Children;
