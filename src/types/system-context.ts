type ISystemContext = {
  errorHandler: (e: Error, name: string, context: {}) => void;
};

export default ISystemContext;
