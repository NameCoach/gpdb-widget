import { createContext } from "react";
import { IPopupContext } from "../types";

export const PopupContext = createContext<IPopupContext>(null);
