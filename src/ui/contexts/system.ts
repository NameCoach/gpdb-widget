import { createContext } from "react";
import ISystemContext from "../../types/system-context";

const SystemContext = createContext<ISystemContext>({
  logger: console,
  errorHandler: (e: Error, name: string) => console.warn(name, e),
});

export default SystemContext;
