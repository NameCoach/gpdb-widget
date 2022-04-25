import STATES from "../states";
import { EVENTS } from "../types/machine";

const defaultSpec = ({ canCustomAttributesCreate }): { [x: string]: any } => ({
  initialState: STATES.INIT,
  canCustomAttributesCreate,
  transitions: [
    {
      name: EVENTS.accept,
      from: STATES.TERMS_AND_CONDITIONS,
      to: STATES.INIT,
    },
    {
      name: EVENTS.start,
      from: [STATES.INIT, STATES.RECORDED],
      to: STATES.STARTED,
    },
    { name: EVENTS.ready, from: STATES.STARTED, to: STATES.RECORD },
    {
      name: EVENTS.stop,
      from: [STATES.RECORD, STATES.FAILED],
      to: STATES.RECORDED,
    },
    { name: EVENTS.save, from: STATES.RECORDED, to: STATES.SAVED },
    { name: EVENTS.fail, from: STATES.ALL, to: STATES.FAILED },
  ],
});

export default defaultSpec;
