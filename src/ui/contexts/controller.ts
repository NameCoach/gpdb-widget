import { createContext } from "react";
import IFrontController from "../../types/front-controller";

const ControllerContext = createContext<IFrontController>(null);

export default ControllerContext;
