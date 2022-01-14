// COMPONENTS
import Widget from "./ui/components/Widget";
import ExtensionWidget from "./ui/components/ExtensionWidget";
import PronunciationMyInfoWidget from "./ui/components/PronunciationMyInfoWidget";
import Loader from "./ui/components/Loader";
import FullNamesList from "./ui/components/FullNamesList";
import Recorder from "./ui/components/Recorder";
import Player from "./ui/components/Player";
import SearchWidget from "./ui/components/SearchWidget";
import InfoWidget from "./ui/components/InfoWidget/InfoWidget";

// TYPES
import type IFrontController from "./types/front-controller";
import type IUserAgentManager from "./types/user-agent-manager";

// LOADER
import loadExtensionClient from "./core/loadExtensionClient";

// INTERFACES
import NameParser, { NPResult } from "./types/name-parser";
import { Configuration } from "gpdb-api-client";
import IStyleContext from "./types/style-context";

// CONTEXTS
import ControllerContext from "./ui/contexts/controller";
import StyleContext from "./ui/contexts/style";

// HOOKS
import loadClient from "./ui/hooks/loadClient";
import useUserAgentManager from "./ui/hooks/useUserAgentManager";

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
  StyleContext,
  IFrontController,
  IStyleContext,
  useUserAgentManager,
  IUserAgentManager,
  loadExtensionClient,
  NPResult,
  NameParser,
  SearchWidget,
  InfoWidget,
};
