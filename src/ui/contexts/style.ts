import { createContext } from "react";
import IStyleContext from "../../types/style-context";

const StyleContext = createContext<IStyleContext>(null);

export default StyleContext;
