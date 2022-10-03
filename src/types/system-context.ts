import Logger from "./logger";

type ISystemContext = {
  errorHandler: (e: Error, name: string, context?: {}) => void;
  logger?: Logger;
};

export default ISystemContext;
