import colors from "./ui/styles/colors.css";

// COMPONENTS
import Widget from "./ui/components/Widget";
import MyInfo from "./ui/components/MyInfo";
import Loader from "./ui/components/Loader";
import FullNamesList from "./ui/components/FullNamesList";
import Recorder from "./ui/components/Recorder";
import Player from "./ui/components/Player";

// TYPES
import type IFrontController from "./types/front-controller";

// INTERFACES
import NameParser, { NPResult } from "./types/name-parser";

// CONTEXTS
import ControllerContext from "./ui/contexts/controller";

// HOOKS
import loadClient from "./ui/hooks/loadClient";

import { Configuration } from "gpdb-api-client";

export {
  Widget,
  MyInfo,
  Recorder,
  Player,
  loadClient,
  Configuration,
  Loader,
  FullNamesList,
  ControllerContext,
  IFrontController,
  NPResult,
  NameParser,
};
