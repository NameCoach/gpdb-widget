import { STATES } from "../states";
import { EVENTS } from "../../types/events";

import { config as defaultConfig } from "./default";

export const config = {
  initialState: STATES.INIT,
  transitions: defaultConfig.transitions.concat({
    name: EVENTS.customAttrs,
    from: STATES.SAVED,
    to: STATES.CUSTOM_ATTRS,
  }),
};

export type IConfiguration = typeof config;
