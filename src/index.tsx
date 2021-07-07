import colors from "./ui/styles/colors.css";

// COMPONENTS
import Widget from "./ui/components/Widget";
import MyInfo from "./ui/components/MyInfo";
import Loader from "./ui/components/Loader";
import FullNamesList from "./ui/components/FullNamesList";

// CONTEXTS
import ControllerContext from "./ui/contexts/controller";

// HOOKS
import loadClient from "./ui/hooks/loadClient";

import { Configuration } from "gpdb-api-client";

export {
  Widget,
  MyInfo,
  loadClient,
  Configuration,
  Loader,
  FullNamesList,
  ControllerContext,
};
