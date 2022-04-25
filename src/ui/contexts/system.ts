import { createContext } from "react";
import ISystemContext from "../../types/system-context";

const SystemContext = createContext<ISystemContext>(null);

export default SystemContext;
