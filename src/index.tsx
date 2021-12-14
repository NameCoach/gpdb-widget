// COMPONENTS
import Widget from "./ui/components/Widget";
import ExtensionWidget from "./ui/components/ExtensionWidget";
import PronunciationMyInfoWidget from "./ui/components/PronunciationMyInfoWidget";
import Loader from "./ui/components/Loader";
import FullNamesList from "./ui/components/FullNamesList";
import Recorder from "./ui/components/Recorder";
import Player from "./ui/components/Player";
import SearchWidget from "./ui/components/SearchWidget";

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
  ExtensionWidget,
  PronunciationMyInfoWidget,
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
  SearchWidget,
};
