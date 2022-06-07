export default interface Logger {
  log: (message: string, module?: string, safeValue?: string) => void;
}
